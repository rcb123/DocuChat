<script lang="ts">
	import ChatWindow from '$components/ChatWindow.svelte';
</script>

<ChatWindow
	endpoint="api/chat/retrieval"
	showIngestForm={true}
	placeholder={'I\'ve got a nose for finding the right documents! Ask, "What is a document loader?"'}
	emoji="🐶"
	titleText="Dana the Document-Retrieving Dog"
>
	<div
		slot="emptyStateComponent"
		class="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden"
	>
		<h1 class="text-3xl md:text-4xl mb-4">SvelteKit + LangChain.js Retrieval Chain 🦜🔗</h1>
		<ul>
			<li class="hidden text-l md:block">
				🔗
				<span class="ml-2">
					This website showcases how to perform retrieval with a{' '}
					<a href="https://js.langchain.com/" target="_blank"> LangChain.js </a>{' '}
					chain and the Vercel{' '}
					<a href="https://sdk.vercel.ai/docs" target="_blank"> AI SDK </a>{' '}
					in a{' '}
					<a href="https://kit.svelte.dev/" target="_blank"> SvelteKit </a>{' '}
					project.
				</span>
			</li>
			<li class="hidden text-l md:block">
				🪜
				<span class="ml-2">The chain works in two steps:</span>
				<ul>
					<li class="ml-4">
						1️⃣
						<span class="ml-2">
							First, it rephrases the input question into a &quot;standalone&quot; question,
							dereferencing pronouns based on the chat history.
						</span>
					</li>
					<li class="ml-4">
						2️⃣
						<span class="ml-2">
							Then, it queries the retriever for documents similar to the dereferenced question and
							composes an answer.
						</span>
					</li>
				</ul>
			</li>
			<li class="hidden text-l md:block">
				💻
				<span class="ml-2">
					You can find the prompt and model logic for this use-case in{' '}
					<code>routes/api/chat/retrieval/+server.ts</code>.
				</span>
			</li>
			<li>
				🐶
				<span class="ml-2">
					By default, the agent is pretending to be a talking puppy, but you can change the prompt
					to whatever you want!
				</span>
			</li>
			<li class="text-l">
				🎨
				<span class="ml-2">
					The main frontend logic is found in{' '}
					<code>routes/retrieval/+page.svelte</code>.
				</span>
			</li>
			<li class="text-l">
				🐙
				<span class="ml-2">
					This website is open source - you can see the source code and deploy your own version{' '}
					<a href="https://github.com/rcb123/DocuChat" target="_blank"> from the GitHub repo </a>
					!
				</span>
			</li>
			<li class="hidden text-l md:block">
				🔱
				<span class="ml-2">
					Before running this example on your own, you&apos;ll first need to set up a Supabase
					vector store. See the README for more details.
				</span>
			</li>
			<li class="text-l">
				👇
				<span class="ml-2">
					Upload some text, then try asking e.g.{' '}
					<code>What is a document loader?</code> below!
				</span>
			</li>
		</ul>
	</div>
</ChatWindow>
