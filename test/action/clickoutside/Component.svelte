<script lang="ts">
	import { clickoutside } from '$lib/action/clickoutside';

	let text = 'unchanged';
</script>

<main>
	<button use:clickoutside={() => (text = 'changed')}>{text}</button>
</main>
