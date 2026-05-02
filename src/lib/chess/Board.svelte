<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chessground } from 'chessground';
  import type { Api } from 'chessground/api';
  import type { Color, Key } from 'chessground/types';
  import PromotionModal from './PromotionModal.svelte';
  import type { PromotionPiece } from './logic';

  let {
    fen,
    orientation,
    lastMove,
    turnColor,
    dests,
    check,
    pendingPromotion,
    promotionColor,
    onMove,
    onPromotionChoice,
  }: {
    fen: string;
    orientation: Color;
    lastMove: [Key, Key] | undefined;
    turnColor: Color | undefined;
    dests: Map<Key, Key[]>;
    check: boolean;
    pendingPromotion: { orig: Key; dest: Key } | null;
    promotionColor: Color;
    onMove: (orig: Key, dest: Key) => void;
    onPromotionChoice: (piece: PromotionPiece) => void;
  } = $props();

  let boardEl: HTMLDivElement;
  let cg: Api | undefined;

  onMount(() => {
    cg = Chessground(boardEl, {
      fen,
      orientation,
      lastMove,
      turnColor,
      movable: {
        free: false,
        color: turnColor,
        dests,
        events: { after: (orig, dest) => onMove(orig, dest) },
      },
      highlight: { lastMove: true, check: true },
      animation: { enabled: true, duration: 150 },
    });
  });

  $effect(() => {
    if (!cg) return;
    cg.set({
      fen,
      lastMove,
      turnColor,
      movable: {
        color: turnColor,
        dests,
        events: { after: (orig, dest) => onMove(orig, dest) },
      },
      check,
    });
  });

  onDestroy(() => cg?.destroy());
</script>

<div class="board-area">
  <div bind:this={boardEl} class="board"></div>
  {#if pendingPromotion}
    <PromotionModal color={promotionColor} onChoose={onPromotionChoice} />
  {/if}
</div>

<style>
  .board-area { position: relative; }

  .board {
    width: min(calc(96vw - 2px), calc(92vh - 80px));
    height: min(calc(96vw - 2px), calc(92vh - 80px));
    display: block;
  }

  :global(.cg-board square.light) { background: #e8d5a3; }
  :global(.cg-board square.dark)  { background: #8b6343; }
  :global(.cg-board square.last-move) { background: rgba(201, 168, 76, 0.45) !important; }
  :global(.cg-board square.move-dest)::after { background: rgba(201, 168, 76, 0.55); }
  :global(.cg-board square.oc.move-dest)::after { border-color: rgba(201, 168, 76, 0.7); }
  :global(.cg-board square.selected) { background: rgba(201, 168, 76, 0.35) !important; }
  :global(.cg-board square.check) {
    background: radial-gradient(ellipse at center, rgba(220,40,40,0.85) 0%, rgba(220,40,40,0) 70%) !important;
  }
</style>