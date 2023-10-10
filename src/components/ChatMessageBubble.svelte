<script lang="ts">
	import type { Message } from 'ai/svelte';

	export let message: Message;
	export let aiEmoji: string = '';
	export let sources: any[];

	const colorClass = message.role === 'user' ? 'bg-sky-600' : 'bg-slate-50 text-black';
	const alignmentClass = message.role === 'user' ? 'ml-auto' : 'mr-auto';
	const prefix = message.role === 'user' ? '🧑' : aiEmoji;
</script>

<div class={`${alignmentClass} ${colorClass} rounded px-4 py-2 max-w-[80%] mb-8 flex`}>
	<div class="mr-2">
		{prefix}
	</div>
	<div class="whitespace-pre-wrap flex flex-col">
		<span>{message.content}</span>
		{#if sources && sources.length}
			<code class="mt-4 mr-auto bg-slate-600 px-2 py-1 rounded">
				<h2>🔍 Sources:</h2>
			</code>
			<code class="mt-1 mr-2 bg-slate-600 px-2 py-1 rounded text-xs">
				{#each sources as source, i ('source:' + i)}
					<div class="mt-2">
						{i + 1}. &quot;{source.pageContent}&quot;
						{#if source.metadata?.loc?.lines !== undefined}
							<div>
								<br />Lines {source.metadata?.loc?.lines?.from} to {source.metadata?.loc?.lines?.to}
							</div>
						{/if}
					</div>
				{/each}
			</code>
		{/if}
	</div>
</div>
