<script lang="ts">
	import { page } from '$app/stores';
	let pathname = $page.route.id;
</script>

<nav class="mb-4">
	<a class={`mr-4 ${pathname === '/' ? 'text-white border-b' : ''}`} href="/">🏴‍☠️ Chat</a>
	<a
		class={`mr-4 ${pathname === '/structured_output' ? 'text-white border-b' : ''}`}
		href="/structured_output">🧱 Structured Output</a
	>
	<a class={`mr-4 ${pathname === '/agents' ? 'text-white border-b' : ''}`} href="/agents"
		>🦜 Agents</a
	>
	<a class={`mr-4 ${pathname === '/retrieval' ? 'text-white border-b' : ''}`} href="/retrieval"
		>🐶 Retrieval</a
	>
	<a
		class={`mr-4 ${pathname === '/retrieval_agents' ? 'text-white border-b' : ''}`}
		href="/retrieval_agents">🤖 Retrieval Agents</a
	>
</nav>
