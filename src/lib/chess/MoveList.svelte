<script lang="ts">
  import NoteInput from './NoteInput.svelte';

  let {
    pairedMoves,
    currentIndex,
    notes,
    onGoToMove,
    onNoteChange,
  }: {
    pairedMoves: { n: number; white: { san: string }; black?: { san: string } }[];
    currentIndex: number;
    notes: Record<number, string>;
    onGoToMove: (index: number) => void;
    onNoteChange: (index: number, value: string) => void;
  } = $props();
</script>

<div class="flex flex-col gap-px">

  {#if pairedMoves.length === 0}
    <div class="flex flex-col items-center gap-2 py-8 text-slate-700">
      <span class="text-3xl opacity-30">♙</span>
      <span class="text-xs">Make a move to begin</span>
    </div>
  {/if}

  {#each pairedMoves as { n, white, black }, i}
    <div class="flex items-center gap-0.5 px-0.5 rounded
      {currentIndex === i * 2 + 1 || currentIndex === i * 2 + 2 ? 'bg-indigo-500/5' : ''}">

      <span class="w-6 text-right text-[0.65rem] text-slate-600 shrink-0 pr-1 tabular-nums select-none">
        {n}
      </span>

      <button
        onclick={() => onGoToMove(i * 2 + 1)}
        class="flex-1 text-left px-1.5 py-0.5 rounded text-[0.82rem] font-mono transition-colors
          {currentIndex === i * 2 + 1
            ? 'bg-indigo-500/20 text-indigo-200 font-semibold border border-indigo-500/35'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}"
      >{white.san}</button>

      {#if !notes[i * 2 + 1] && black}
        <button
          onclick={() => onGoToMove(i * 2 + 2)}
          class="flex-1 text-left px-1.5 py-0.5 rounded text-[0.82rem] font-mono transition-colors
            {currentIndex === i * 2 + 2
              ? 'bg-indigo-500/20 text-indigo-200 font-semibold border border-indigo-500/35'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}"
        >{black.san}</button>
      {:else if !black}
        <span class="flex-1"></span>
      {/if}
    </div>

    {#if currentIndex === i * 2 + 1}
      <NoteInput value={notes[i * 2 + 1] ?? ''} onChange={(v) => onNoteChange(i * 2 + 1, v)} />
    {:else if notes[i * 2 + 1]}
      <button
        onclick={() => onGoToMove(i * 2 + 1)}
        class="flex items-baseline gap-1.5 w-full text-left px-2 py-1 my-0.5 rounded-r border-l-2 border-yellow-500/40 bg-yellow-500/7 text-yellow-700 hover:bg-yellow-500/12 transition-colors text-[0.72rem] leading-snug"
      >
        <span class="text-[0.55rem] font-bold tracking-widest uppercase text-yellow-600/50 shrink-0">note</span>
        {notes[i * 2 + 1]}
      </button>
    {/if}

    {#if notes[i * 2 + 1] && black}
      <div class="flex items-center gap-0.5 px-0.5 rounded
        {currentIndex === i * 2 + 2 ? 'bg-indigo-500/5' : ''}">
        <span class="w-6 text-right text-[0.65rem] text-slate-600 shrink-0 pr-1 tabular-nums select-none">{n}</span>
        <span class="px-1.5 py-0.5 text-[0.82rem] text-slate-600 select-none">…</span>
        <button
          onclick={() => onGoToMove(i * 2 + 2)}
          class="flex-1 text-left px-1.5 py-0.5 rounded text-[0.82rem] font-mono transition-colors
            {currentIndex === i * 2 + 2
              ? 'bg-indigo-500/20 text-indigo-200 font-semibold border border-indigo-500/35'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}"
        >{black.san}</button>
      </div>
    {/if}

    {#if currentIndex === i * 2 + 2}
      <NoteInput value={notes[i * 2 + 2] ?? ''} onChange={(v) => onNoteChange(i * 2 + 2, v)} />
    {:else if notes[i * 2 + 2]}
      <button
        onclick={() => onGoToMove(i * 2 + 2)}
        class="flex items-baseline gap-1.5 w-full text-left px-2 py-1 my-0.5 rounded-r border-l-2 border-yellow-500/40 bg-yellow-500/7 text-yellow-700 hover:bg-yellow-500/12 transition-colors text-[0.72rem] leading-snug"
      >
        <span class="text-[0.55rem] font-bold tracking-widest uppercase text-yellow-600/50 shrink-0">note</span>
        {notes[i * 2 + 2]}
      </button>
    {/if}

  {/each}
</div>