import type { RequestHandler } from '@sveltejs/kit';

import { SUPABASE_URL, SUPABASE_PRIVATE_KEY, OPENAI_API_KEY } from '$env/static/private';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { createClient } from '@supabase/supabase-js';

export const config = {
	runtime: 'edge'
};

// Before running, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase
// and add your Supabase URL and private key to your .env file.

/**
 * This handler takes input text, splits it into chunks, and embeds those chunks
 * into a vector store for later retrieval. See the following docs for more information:
 *
 * https://js.langchain.com/docs/modules/data_connection/document_transformers/text_splitters/recursive_text_splitter
 * https://js.langchain.com/docs/modules/data_connection/vectorstores/integrations/supabase
 */
export const POST: RequestHandler = async ({ request }) => {
	const body = request.body ? await request.text() : '';
	const { text } = JSON.parse(body);

	try {
		const client = createClient(SUPABASE_URL, SUPABASE_PRIVATE_KEY);

		const splitter = RecursiveCharacterTextSplitter.fromLanguage('markdown', {
			chunkSize: 256,
			chunkOverlap: 20
		});

		const splitDocuments = await splitter.createDocuments([text]);

		await SupabaseVectorStore.fromDocuments(
			splitDocuments,
			new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
			{
				client,
				tableName: 'documents',
				queryName: 'match_documents'
			}
		);

		return new Response(JSON.stringify({ ok: true }), {
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
