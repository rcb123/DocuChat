<script lang="ts">
	import ChatWindow from '$components/ChatWindow.svelte';
</script>

<ChatWindow
	endpoint="api/chat/retrieval_agents"
	showIngestForm={true}
	showIntermediateStepsToggle={true}
	placeholder={'Beep boop! I\'m a robot retrieval-focused agent! Ask, "What are some ways of doing retrieval in LangChain.js?"'}
	emoji="🤖"
	titleText="Robbie the Retrieval Robot"
>
	<div
		slot="emptyStateComponent"
		class="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden"
	>
		<h1 class="text-3xl md:text-4xl mb-4">SvelteKit + LangChain.js Retrieval Agent 🦜🔗</h1>
		<ul>
			<li class="hidden text-l md:block">
				🤝
				<span class="ml-2">
					This website showcases a{' '}
					<a href="https://js.langchain.com/" target="_blank"> LangChain.js </a>{' '}
					retrieval chain and the Vercel{' '}
					<a href="https://sdk.vercel.ai/docs" target="_blank"> AI SDK </a>{' '}
					in a{' '}
					<a href="https://kit.svelte.dev/" target="_blank"> SvelteKit </a>{' '}
					project.
				</span>
			</li>
			<li class="hidden text-l md:block">
				🛠️
				<span class="ml-2">
					The agent has access to a vector store retriever as a tool as well as a memory. It&apos;s
					particularly well suited to meta-questions about the current conversation.
				</span>
			</li>
			<li class="hidden text-l md:block">
				💻
				<span class="ml-2">
					You can find the prompt and model logic for this use-case in{' '}
					<code>routes/api/chat/retrieval_agents/+server.ts</code>.
				</span>
			</li>
			<li>
				🤖
				<span class="ml-2">
					By default, the agent is pretending to be a robot, but you can change the prompt to
					whatever you want!
				</span>
			</li>
			<li class="hidden text-l md:block">
				🎨
				<span class="ml-2">
					The main frontend logic is found in{' '}
					<code>routes/retrieval_agents/+page.svelte</code>.
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
					Before running this example, you&apos;ll first need to set up a Supabase (or other) vector
					store. See the README for more details.
				</span>
			</li>
			<li class="text-l">
				👇
				<span class="ml-2">
					Upload some text, then try asking e.g.{' '}
					<code>What are some ways of doing retrieval in LangChain</code>{' '}
					below!
				</span>
			</li>
		</ul>
	</div>
</ChatWindow>
