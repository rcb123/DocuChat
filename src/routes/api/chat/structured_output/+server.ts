import type { RequestHandler } from '@sveltejs/kit';

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';

export const config = {
	runtime: 'edge'
};

const TEMPLATE = `Extract the requested fields from the input.

The field "entity" refers to the first mentioned entity in the input.

Input:

{input}`;

/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/chains/popular/structured_output
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const messages = body.messages ?? [];
		const currentMessageContent = messages[messages.length - 1].content;

		const prompt = PromptTemplate.fromTemplate(TEMPLATE);
		/**
		 * Function calling is currently only supported with ChatOpenAI models
		 */
		const model = new ChatOpenAI({
			temperature: 0.8,
			modelName: 'gpt-4'
		});

		/**
		 * We use Zod (https://zod.dev) to define our schema for convenience,
		 * but you can pass JSON Schema directly if desired.
		 */
		const schema = z.object({
			tone: z.enum(['positive', 'negative', 'neutral']).describe('The overall tone of the input'),
			entity: z.string().describe('The entity mentioned in the input'),
			word_count: z.number().describe('The number of words in the input'),
			chat_response: z.string().describe("A response to the human's input"),
			final_punctuation: z
				.optional(z.string())
				.describe('The final punctuation mark in the input, if any.')
		});

		/**
		 * Bind the function and schema to the OpenAI model.
		 * Future invocations of the returned model will always use these arguments.
		 *
		 * Specifying "function_call" ensures that the provided function will always
		 * be called by the model.
		 */
		const functionCallingModel = model.bind({
			functions: [
				{
					name: 'output_formatter',
					description: 'Should always be used to properly format output',
					parameters: zodToJsonSchema(schema)
				}
			],
			function_call: { name: 'output_formatter' }
		});

		/**
		 * Returns a chain with the function calling model.
		 */
		const chain = prompt.pipe(functionCallingModel).pipe(new JsonOutputFunctionsParser());

		const result = await chain.invoke({
			input: currentMessageContent
		});

		return new Response(JSON.stringify(result), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (e: unknown) {
		return new Response(JSON.stringify({ error: (e as Error).message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
