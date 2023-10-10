<script>
	import '../app.css';

	import Navbar from '$components/Navbar.svelte';

	import Toaster from '$lib/Toaster.svelte';
</script>

<Toaster />

<div class="flex flex-col p-4 md:p-12 h-[100vh]">
	<Navbar />
	<slot />
</div>
