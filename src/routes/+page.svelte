<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Login from './(components)/login.svelte';
	import { enhance } from '$app/forms';

	export let data;
</script>

<section class="flex min-h-screen justify-center">
	<div class="flex w-full max-w-3xl flex-col border p-4">
		<div class="flex justify-between">
			{#if data.username}
				<form method="post" use:enhance>
					<Button type="submit">Sign out</Button>
				</form>
			{:else}
				<Login />
			{/if}
			<Button>tweet</Button>
		</div>
		{data.username}
	</div>
</section>
