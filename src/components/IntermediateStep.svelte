<script lang="ts">
	import type { Message } from 'ai/svelte';
	import type { AgentStep } from 'langchain/schema';

	export let message: Message;

	const parsedInput: AgentStep = JSON.parse(message.content);
	const action = parsedInput.action;
	const observation = parsedInput.observation;

	let expanded = false;
</script>

<div
	class="ml-auto bg-green-600 rounded px-4 py-2 max-w-[80%] mb-8 whitespace-pre-wrap flex flex-col cursor-pointer"
>
	<button
		class={`text-right ${expanded ? 'w-full' : ''}`}
		on:click={() => (expanded = true)}
		on:keydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				expanded = true;
			}
		}}
	>
		<code class="mr-2 bg-slate-600 px-2 py-1 rounded hover:text-blue-600">
			🛠️ <b>{action.tool}</b>
		</code>
		<span class={expanded ? 'hidden' : ''}>🔽</span>
		<span class={expanded ? '' : 'hidden'}>🔼</span>
	</button>
	<div
		class={`overflow-hidden max-h-[0px] transition-[max-height] ease-in-out ${
			expanded ? 'max-h-[360px]' : ''
		}`}
	>
		<div
			class={`bg-slate-600 rounded p-4 mt-1 max-w-0 ${
				expanded ? 'max-w-full' : 'transition-[max-width] delay-100'
			}`}
		>
			<code
				class={`opacity-0 max-h-[100px] overflow-auto transition ease-in-out delay-150 ${
					expanded ? 'opacity-100' : ''
				}`}
			>
				Tool Input:
				<br />
				<br />
				{JSON.stringify(action.toolInput)}
			</code>
		</div>
		<div
			class={`bg-slate-600 rounded p-4 mt-1 max-w-0 ${
				expanded ? 'max-w-full' : 'transition-[max-width] delay-100'
			}`}
		>
			<code
				class={`opacity-0 max-h-[260px] overflow-auto transition ease-in-out delay-150 ${
					expanded ? 'opacity-100' : ''
				}`}>{observation}</code
			>
		</div>
	</div>
</div>
