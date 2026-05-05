<script lang="ts">
  import { onMount } from 'svelte';

  let { onNext, onPrev, onFirst, onLast, currentIndex, totalMoves } = $props<{
    onNext: () => void;
    onPrev: () => void;
    onFirst: () => void;
    onLast: () => void;
    currentIndex: number;
    totalMoves: number;
  }>();

  let shortcutsOpen = $state(false);

  function handleKeydown(e: KeyboardEvent) {
    if (e.target instanceof HTMLTextAreaElement) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); onPrev(); }
    if (e.key === 'Home')       { e.preventDefault(); onFirst(); }
    if (e.key === 'End')        { e.preventDefault(); onLast(); }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="flex flex-col items-center gap-1.5 w-full">

  <div class="flex items-center gap-0.5 bg-white/[0.03] border border-white/8 rounded-lg p-1">

    <button
      onclick={onFirst}
      disabled={currentIndex === 0}
      title="Skip to start (Home)"
      class="flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-white/8 hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
      </svg>
    </button>

    <button
      onclick={onPrev}
      disabled={currentIndex === 0}
      title="Previous (←)"
      class="flex items-center justify-center w-10 h-10 rounded-md text-slate-400 hover:bg-indigo-500/15 hover:text-indigo-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
      </svg>
    </button>

    <button
      onclick={onNext}
      disabled={totalMoves === 0 || currentIndex >= totalMoves}
      title="Next (→)"
      class="flex items-center justify-center w-10 h-10 rounded-md text-slate-400 hover:bg-indigo-500/15 hover:text-indigo-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    </button>

    <button
      onclick={onLast}
      disabled={totalMoves === 0 || currentIndex >= totalMoves}
      title="Skip to end (End)"
      class="flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-white/8 hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.91V8.09L8.5 12zM16 6h2v12h-2z"/>
      </svg>
    </button>

  </div>

  <p class="text-[0.65rem] text-slate-600 tabular-nums">
    {#if totalMoves === 0}
      No moves yet
    {:else}
      Move <span class="text-slate-500 font-semibold">{currentIndex}</span>
      of <span class="text-slate-500 font-semibold">{totalMoves}</span>
    {/if}
  </p>

  <div class="w-full mt-1 rounded-lg border border-white/6 overflow-hidden text-xs">
    <button
      onclick={() => shortcutsOpen = !shortcutsOpen}
      class="flex items-center gap-2 w-full px-3 py-1.5 bg-white/[0.03] text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] transition-colors text-left"
    >
      <svg
        class="w-3 h-3 transition-transform {shortcutsOpen ? 'rotate-90' : ''}"
        viewBox="0 0 24 24" fill="currentColor"
      >
        <path d="M8 5v14l11-7z"/>
      </svg>
      <span class="font-medium tracking-wide">Shortcuts</span>
    </button>

    {#if shortcutsOpen}
      <div class="px-3 py-2 bg-white/[0.015] flex flex-col gap-1.5 text-[0.68rem]">
        {#each [
          ['←', 'Previous move'],
          ['→', 'Next move']
        ] as [key, label]}
          <div class="flex items-center justify-between gap-4">
            <span class="text-slate-600">{label}</span>
            <kbd class="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 font-mono text-[0.65rem]">{key}</kbd>
          </div>
        {/each}
      </div>
    {/if}
  </div>

</div>