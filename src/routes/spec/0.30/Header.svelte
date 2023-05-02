<script>
	export let showToc = true;
	export let showOnlySelected = false;
</script>

<div class="header">
	<div class="left">
		<span class="title">CommonMark Spec</span>
	</div>
	<div class="right">
		<label title="Show table of contents sidebar">
			<input type="checkbox" bind:checked={showToc} /> ToC
		</label>
		<label title="Show only contents of selected section">
			<input type="checkbox" bind:checked={showOnlySelected} /> Only selected
		</label>
	</div>
</div>

<style>
	.header {
		height: 30px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		border-bottom: 1px solid black;
	}
	.header > * {
		margin: 0 8px;
	}

	.title {
		font-weight: bold;
	}

	label {
		margin: 0 4px;
		user-select: none;
		cursor: pointer;
	}
</style>
