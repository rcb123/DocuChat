<script lang="ts">
	import ChatWindow from '$components/ChatWindow.svelte';
</script>

<ChatWindow
	endpoint="api/chat"
	emoji="🏴‍☠️"
	titleText="Patchy the Chatty Pirate"
	placeholder="I'm an LLM pretending to be a pirate! Ask me about the pirate life!"
>
	<div
		slot="emptyStateComponent"
		class="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden"
	>
		<h1 class="text-3xl md:text-4xl mb-4">SvelteKit + LangChain.js 🦜🔗</h1>
		<ul>
			<li class="text-l">
				🤝
				<span class="ml-2">
					This website showcases a simple chatbot using{' '}
					<a href="https://js.langchain.com/" target="_blank"> LangChain.js </a>{' '}
					and the Vercel{' '}
					<a href="https://sdk.vercel.ai/docs" target="_blank"> AI SDK </a>{' '}
					in a{' '}
					<a href="https://kit.svelte.dev/" target="_blank"> SvelteKit </a>{' '}
					project.
				</span>
			</li>
			<li class="hidden text-l md:block">
				💻
				<span class="ml-2">
					You can find the prompt and model logic for this use-case in{' '}
					<code>routes/api/chat/+server.ts</code>.
				</span>
			</li>
			<li>
				🏴‍☠️
				<span class="ml-2">
					By default, the bot is pretending to be a pirate, but you can change the prompt to
					whatever you want!
				</span>
			</li>
			<li class="hidden text-l md:block">
				🎨
				<span class="ml-2">
					The main frontend logic is found in <code>routes/+page.svelte</code>.
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
			<li class="text-l">
				👇
				<span class="ml-2">
					Try asking e.g. <code>What is it like to be a pirate?</code> below!
				</span>
			</li>
		</ul>
	</div>
</ChatWindow>
