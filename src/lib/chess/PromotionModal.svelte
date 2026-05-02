<script lang="ts">
  import type { Color } from 'chessground/types';
  import type { PromotionPiece } from './logic';

  let {
    color,
    onChoose,
  }: {
    color: Color;
    onChoose: (piece: PromotionPiece) => void;
  } = $props();

  const pieces: { piece: PromotionPiece; label: string; symbol: string }[] = $derived([
    { piece: 'q', label: 'Queen',  symbol: color === 'white' ? '♕' : '♛' },
    { piece: 'r', label: 'Rook',   symbol: color === 'white' ? '♖' : '♜' },
    { piece: 'b', label: 'Bishop', symbol: color === 'white' ? '♗' : '♝' },
    { piece: 'n', label: 'Knight', symbol: color === 'white' ? '♘' : '♞' },
  ]);
</script>

<div class="overlay" role="dialog" aria-modal="true" aria-label="Choose promotion piece">
  <div class="modal">
    <p class="title">Promote pawn</p>
    <div class="choices">
      {#each pieces as { piece, label, symbol }}
        <button
          class="choice"
          onclick={() => onChoose(piece)}
          aria-label={label}
          title={label}
        >
          <span class="symbol">{symbol}</span>
          <span class="label">{label}</span>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(10, 8, 5, 0.72);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .modal {
    border-radius: 4px;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
  }

  .title {
    font-family: var(--font-display);
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 0;
  }

  .choices {
    display: flex;
    gap: 0.5rem;
  }

  .choice {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 0.75rem 0.9rem;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
    color: var(--text);
  }

  .choice:hover {
    background: var(--accent-muted);
    border-color: var(--accent);
    transform: translateY(-2px);
  }

  .symbol {
    font-size: 2rem;
    line-height: 1;
  }

  .label {
    font-family: var(--font-display);
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }
</style>