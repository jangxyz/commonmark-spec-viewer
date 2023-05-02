<script>
	import { page } from '$app/stores';
	import SpecViewer from './SpecViewer.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<SpecViewer
	spec={data.spec}
	urlHash={$page.url.hash}
	showOnlySelected={$page.url.searchParams?.get('show-only-selected') === '1'}
/>
