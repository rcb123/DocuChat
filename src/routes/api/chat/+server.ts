import type { Message as VercelChatMessage } from 'ai';
import type { RequestHandler } from '@sveltejs/kit';

import { BytesOutputParser } from 'langchain/schema/output_parser';
import { RunnableSequence } from 'langchain/schema/runnable';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { PromptTemplate } from 'langchain/prompts';
import { StreamingTextResponse } from 'ai';

export const config = {
	runtime: 'edge'
};

const formatMessage = (message: VercelChatMessage) => {
	return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.

Current conversation:
{chat_history}

User: {input}
AI:`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const messages = body.messages ?? [];
		const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
		const currentMessageContent = messages[messages.length - 1].content;
		const prompt = PromptTemplate.fromTemplate(TEMPLATE);

		const model = new ChatOpenAI({
			openAIApiKey: OPENAI_API_KEY,
			temperature: 0.8
		});

		/**
		 * Chat models stream message chunks rather than bytes, so this
		 * output parser handles serialization and byte-encoding.
		 */
		const outputParser = new BytesOutputParser();

		const chain = RunnableSequence.from([prompt, model, outputParser]);

		const stream = await chain.stream({
			chat_history: formattedPreviousMessages.join('\n'),
			input: currentMessageContent
		});

		return new StreamingTextResponse(stream);
	} catch (e: unknown) {
		return new Response(JSON.stringify({ error: (e as Error).message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
