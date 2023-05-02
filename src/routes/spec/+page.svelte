<script>
	import { page } from '$app/stores';
	import SpecViewer from './SpecViewer.svelte';

	let searchParams = $page.url.searchParams;
	let urlHash = $page.url.hash;
	$: searchParams = $page.url.searchParams;
	$: urlHash = $page.url.hash;

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<SpecViewer
	spec={data.spec}
	{urlHash}
	showOnlySelected={searchParams?.get('show-only-selected') === '1'}
/>
