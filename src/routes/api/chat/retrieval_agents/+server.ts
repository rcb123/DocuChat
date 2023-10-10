import type { Message as VercelChatMessage } from 'ai';
import type { RequestHandler } from '@sveltejs/kit';

import { createClient } from '@supabase/supabase-js';

import { AIMessage, ChatMessage, HumanMessage } from 'langchain/schema';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { StreamingTextResponse } from 'ai';
import { createRetrieverTool, OpenAIAgentTokenBufferMemory } from 'langchain/agents/toolkits';
import { ChatMessageHistory } from 'langchain/memory';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';

export const config = {
	runtime: 'edge'
};

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
	if (message.role === 'user') {
		return new HumanMessage(message.content);
	} else if (message.role === 'assistant') {
		return new AIMessage(message.content);
	} else {
		return new ChatMessage(message.content, message.role);
	}
};

const TEMPLATE = `You are a stereotypical robot named Robbie and must answer all questions like a stereotypical robot. Use lots of interjections like "BEEP" and "BOOP".

If you don't know how to answer a question, use the available tools to look up relevant information. You should particularly do this for questions about LangChain.`;

/**
 * This handler initializes and calls a retrieval agent. It requires an OpenAI
 * Functions model. See the docs for more information:
 *
 * https://js.langchain.com/docs/use_cases/question_answering/conversational_retrieval_agents
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		/**
		 * We represent intermediate steps as system messages for display purposes,
		 * but don't want them in the chat history.
		 */
		const messages = (body.messages ?? []).filter(
			(message: VercelChatMessage) => message.role === 'user' || message.role === 'assistant'
		);
		const returnIntermediateSteps = body.show_intermediate_steps;
		const previousMessages = messages.slice(0, -1);
		const currentMessageContent = messages[messages.length - 1].content;

		const model = new ChatOpenAI({
			modelName: 'gpt-4'
		});

		const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);
		const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
			client,
			tableName: 'documents',
			queryName: 'match_documents'
		});

		const chatHistory = new ChatMessageHistory(
			previousMessages.map(convertVercelMessageToLangChainMessage)
		);

		/**
		 * This is a special type of memory specifically for conversational
		 * retrieval agents.
		 * It tracks intermediate steps as well as chat history up to a
		 * certain number of tokens.
		 *
		 * The default OpenAI Functions agent prompt has a placeholder named
		 * "chat_history" where history messages get injected - this is why
		 * we set "memoryKey" to "chat_history". This will be made clearer
		 * in a future release.
		 */
		const memory = new OpenAIAgentTokenBufferMemory({
			llm: model,
			memoryKey: 'chat_history',
			outputKey: 'output',
			chatHistory
		});

		const retriever = vectorstore.asRetriever();

		/**
		 * Wrap the retriever in a tool to present it to the agent in a
		 * usable form.
		 */
		const tool = createRetrieverTool(retriever, {
			name: 'search_latest_knowledge',
			description: 'Searches and returns up-to-date general information.'
		});

		const executor = await initializeAgentExecutorWithOptions([tool], model, {
			agentType: 'openai-functions',
			memory,
			returnIntermediateSteps: true,
			verbose: true,
			agentArgs: {
				prefix: TEMPLATE
			}
		});

		const result = await executor.call({
			input: currentMessageContent
		});

		if (returnIntermediateSteps) {
			return new Response(
				JSON.stringify({ output: result.output, intermediate_steps: result.intermediateSteps }),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		} else {
			// Agent executors don't support streaming responses (yet!), so stream back the complete response one
			// character at a time to simluate it.
			const textEncoder = new TextEncoder();
			const fakeStream = new ReadableStream({
				async start(controller) {
					for (const character of result.output) {
						controller.enqueue(textEncoder.encode(character));
						await new Promise((resolve) => setTimeout(resolve, 20));
					}
					controller.close();
				}
			});

			return new StreamingTextResponse(fakeStream);
		}
	} catch (e: unknown) {
		return new Response(JSON.stringify({ error: (e as Error).message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
