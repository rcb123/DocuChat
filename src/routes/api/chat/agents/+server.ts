import type { Message as VercelChatMessage } from 'ai';
import type { RequestHandler } from '@sveltejs/kit';

import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Calculator } from 'langchain/tools/calculator';
import { StreamingTextResponse } from 'ai';
import { SerpAPI } from 'langchain/tools';

import { AIMessage, ChatMessage, HumanMessage } from 'langchain/schema';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { OPENAI_API_KEY } from '$env/static/private';

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

const PREFIX_TEMPLATE = `You are a talking parrot named Polly. All final responses must be how a talking parrot would respond.`;

/**
 * This handler initializes and calls an OpenAI Functions agent.
 * See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/agents/agent_types/openai_functions_agent
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
		const previousMessages = messages.slice(0, -1).map(convertVercelMessageToLangChainMessage);
		const currentMessageContent = messages[messages.length - 1].content;

		// Requires process.env.SERPAPI_API_KEY to be set: https://serpapi.com/
		const tools = [new Calculator(), new SerpAPI()];
		const chat = new ChatOpenAI({ modelName: 'gpt-4', temperature: 0, openAIApiKey: OPENAI_API_KEY });

		/**
		 * The default prompt for the OpenAI functions agent has a placeholder
		 * where chat messages get injected - that's why we set "memoryKey" to
		 * "chat_history". This will be made clearer and more customizable in the future.
		 */
		const executor = await initializeAgentExecutorWithOptions(tools, chat, {
			agentType: 'openai-functions',
			verbose: true,
			returnIntermediateSteps,
			memory: new BufferMemory({
				memoryKey: 'chat_history',
				chatHistory: new ChatMessageHistory(previousMessages),
				returnMessages: true,
				outputKey: 'output'
			}),
			agentArgs: {
				prefix: PREFIX_TEMPLATE
			}
		});

		const result = await executor.call({
			input: currentMessageContent
		});

		// Intermediate steps are too complex to stream
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
			/**
			 * Agent executors don't support streaming responses (yet!), so stream back the
			 * complete response one character at a time with a delay to simluate it.
			 */
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
