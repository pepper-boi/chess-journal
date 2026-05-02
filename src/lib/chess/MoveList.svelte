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

<div class="move-area">
  {#each pairedMoves as { n, white, black }, i}
    <div class="move-row">
      <span class="move-num">{n}.</span>
      <button
        class="move"
        class:active={currentIndex === i * 2 + 1}
        onclick={() => onGoToMove(i * 2 + 1)}
      >
        {white.san}
      </button>

      {#if !notes[i * 2 + 1] && black}
        <button
          class="move"
          class:active={currentIndex === i * 2 + 2}
          onclick={() => onGoToMove(i * 2 + 2)}
        >
          {black.san}
        </button>
      {/if}
    </div>

    {#if currentIndex === i * 2 + 1}
      <NoteInput
        value={notes[i * 2 + 1] ?? ''}
        onChange={(value) => onNoteChange(i * 2 + 1, value)}
      />
    {:else if notes[i * 2 + 1]}
      <button
        class="note-text clickable"
        onclick={() => onGoToMove(i * 2 + 1)}
      >
        {notes[i * 2 + 1]}
      </button>
    {/if}

    {#if notes[i * 2 + 1] && black}
      <div class="move-row">
        <span class="move-num">{n}.</span>
        <span class="move-ellipsis">...</span>
        <button
          class="move"
          class:active={currentIndex === i * 2 + 2}
          onclick={() => onGoToMove(i * 2 + 2)}
        >
          {black.san}
        </button>
      </div>
    {/if}

    {#if currentIndex === i * 2 + 2}
      <NoteInput
        value={notes[i * 2 + 2] ?? ''}
        onChange={(value) => onNoteChange(i * 2 + 2, value)}
      />
    {:else if notes[i * 2 + 2]}
      <button
        class="note-text clickable"
        onclick={() => onGoToMove(i * 2 + 2)}
      >
        {notes[i * 2 + 2]}
      </button>
    {/if}
  {/each}
</div>

<style>
  .move-area {
    height: min(calc(96vw - 2px), calc(92vh - 80px));
    overflow-y: auto;
    width: 25em;
  }

  .move-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .move-num { color: gray; width: 1.5rem; }

  .move-ellipsis { color: gray; padding: 0.2rem 0.4rem; }

  .move {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
  }

  .move.active { background: rgba(201, 168, 76, 0.45); }

  .note-text {
    font-size: 0.78rem;
    color: var(--text, #ccc);
    background: rgba(201, 168, 76, 0.08);
    border-left: 2px solid rgba(201, 168, 76, 0.5);
    padding: 0.4rem 0.5rem;
    margin: 0.25rem 0;
    line-height: 1.5;
    white-space: pre-wrap;
  }

  .note-text.clickable {
    display: block;
    width: 100%;
    text-align: left;
    border: none;
    cursor: pointer;
  }

  .note-text.clickable:hover {
    background: rgba(201, 168, 76, 0.15);
  }
</style>