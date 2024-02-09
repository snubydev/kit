<script lang="ts">
	import type { PageData } from './$types';

	/** @type {number} */
	export let row: number;

	/** @type {number} */
	export let column: number;

	/** @type {number} */
	export let i: number;

	/** @type {import('./$types').PageData} */
	export let data: PageData;

	/** @type {string} */
	export let currentGuess: string;

	$: current = row === i;
	$: answer = data.answers[row]?.[column];
	$: exact = answer === 'x';
	$: close = answer === 'c';
	$: missing = answer === '_';
	$: guess = current ? currentGuess : data.guesses[row];
	$: selected = current && column === guess.length;
	$: value = guess?.[column] ?? '';
</script>

<div class="letter" class:exact class:close class:missing class:selected>
	{value}
	<span class="visually-hidden">
		{#if exact}
			(correct)
		{:else if close}
			(present)
		{:else if missing}
			(absent)
		{:else}
			empty
		{/if}
	</span>
	<input name="guess" disabled={!current} type="hidden" {value} />
</div>

<style>
	.letter {
		aspect-ratio: 1;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		box-sizing: border-box;
		text-transform: lowercase;
		border: none;
		font-size: calc(0.08 * var(--width));
		border-radius: 2px;
		background: white;
		margin: 0;
		color: rgba(0, 0, 0, 0.7);
	}

	.letter.missing {
		background: rgba(255, 255, 255, 0.5);
		color: rgba(0, 0, 0, 0.5);
	}

	.letter.exact {
		background: var(--color-theme-2);
		color: white;
	}

	.letter.close {
		border: 2px solid var(--color-theme-2);
	}

	.selected {
		outline: 2px solid var(--color-theme-1);
	}
</style>
