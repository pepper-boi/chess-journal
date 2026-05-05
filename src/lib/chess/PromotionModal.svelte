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

<div
  class="absolute inset-0 z-10 flex items-center justify-center bg-gray-950/75 backdrop-blur-sm"
  role="dialog" aria-modal="true" aria-label="Choose promotion piece"
>
  <div class="flex flex-col items-center gap-4 bg-gray-900 border border-indigo-500/20 rounded-xl px-7 py-6 shadow-2xl">
    <p class="text-[0.6rem] font-bold tracking-[0.14em] uppercase text-slate-600">Promote pawn</p>
    <div class="flex gap-2">
      {#each pieces as { piece, label, symbol }}
        <button
          onclick={() => onChoose(piece)}
          aria-label={label}
          title={label}
          class="flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg
            border border-white/8 bg-white/[0.03] text-slate-200
            hover:bg-indigo-500/15 hover:border-indigo-500/40 hover:-translate-y-0.5
            transition-all duration-100"
        >
          <span class="text-4xl leading-none">{symbol}</span>
          <span class="text-[0.58rem] font-bold tracking-widest uppercase text-slate-600">{label}</span>
        </button>
      {/each}
    </div>
  </div>
</div>