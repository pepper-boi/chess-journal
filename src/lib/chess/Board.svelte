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

<div class="relative">
  <div bind:this={boardEl} class="board"></div>
  {#if pendingPromotion}
    <PromotionModal color={promotionColor} onChoose={onPromotionChoice} />
  {/if}
</div>

<style>
  .board {
    width: min(calc(96vw - 292px), calc(94vh - 132px));
    height: min(calc(96vw - 280px), calc(94vh - 132px));
    display: block;
  }

  :global(.cg-board square.light) { background: #ede0c8; }
  :global(.cg-board square.dark)  { background: #7c5c3e; }
  :global(.cg-board square.last-move)  { background: rgba(99,102,241,0.28) !important; }
  :global(.cg-board square.selected)   { background: rgba(99,102,241,0.22) !important; }
  :global(.cg-board square.move-dest)::after   { background: rgba(99,102,241,0.45); }
  :global(.cg-board square.oc.move-dest)::after { border-color: rgba(99,102,241,0.6); }
  :global(.cg-board square.check) {
    background: radial-gradient(ellipse at center, rgba(239,68,68,0.9) 0%, transparent 68%) !important;
  }
</style>