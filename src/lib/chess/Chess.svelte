<script lang="ts">
  import { Chess, type Square } from 'chess.js';
  import type { Color, Key } from 'chessground/types';
  import Board from './Board.svelte';
  import MoveList from './MoveList.svelte';
  import Controls from './Controls.svelte';
  import { toDests, turnColor, isPromotion, pairMoves, getGameStatus, toPgn, type PromotionPiece } from './logic';

  type VerboseMove = { san: string; from: string; to: string; promotion?: string };

  let { importedMoves = [], onNewGame }: {
    importedMoves: VerboseMove[];
    onNewGame: () => void;
  } = $props();

  let orientation: Color = $state('white');
  let moves: VerboseMove[] = $derived(importedMoves);
  let currentIndex: number = $derived(importedMoves.length);
  let notes: Record<number, string> = $state({});
  let pendingPromotion: { orig: Key; dest: Key } | null = $state(null);
  let showNewGameWarning: boolean = $state(false);

  let boardChess = $derived.by(() => {
    const c = new Chess();
    for (const m of moves.slice(0, currentIndex)) {
      c.move({ from: m.from as Square, to: m.to as Square, promotion: m.promotion });
    }
    return c;
  });

  let isLatest = $derived(currentIndex === moves.length);
  let activeTurnColor = $derived(isLatest ? turnColor(boardChess) : undefined);
  let activeDests = $derived(isLatest ? toDests(boardChess) : new Map<Key, Key[]>());
  let activeCheck = $derived(isLatest && boardChess.isCheck());
  let gameStatus = $derived(getGameStatus(boardChess));
  let lastMove = $derived(
    currentIndex > 0
      ? [moves[currentIndex - 1].from, moves[currentIndex - 1].to] as [Key, Key]
      : undefined
  );
  let pairedMoves = $derived(pairMoves(moves));

  function applyMove(orig: Key, dest: Key, promotion?: PromotionPiece): void {
    const result = boardChess.move({ from: orig as Square, to: dest as Square, promotion });
    moves = [...moves.slice(0, currentIndex), result as VerboseMove];
    currentIndex = moves.length;
  }

  function handleMove(orig: Key, dest: Key): void {
    if (isPromotion(boardChess, orig, dest)) {
      pendingPromotion = { orig, dest };
    } else {
      applyMove(orig, dest);
    }
  }

  function handlePromotionChoice(piece: PromotionPiece): void {
    if (!pendingPromotion) return;
    const { orig, dest } = pendingPromotion;
    pendingPromotion = null;
    applyMove(orig, dest, piece);
  }

  function goToMove(index: number): void {
    currentIndex = index;
  }

  function nextMove(): void {
    if (currentIndex < moves.length) goToMove(currentIndex + 1);
  }

  function prevMove(): void {
    if (currentIndex > 0) goToMove(currentIndex - 1);
  }

  function firstMove(): void {
    goToMove(0);
  }

  function toLastMove(): void {
    goToMove(moves.length);
  }

  function undoMove(): void {
    if (moves.length === 0) return;
    const newMoves = moves.slice(0, -1);
    moves = newMoves;
    currentIndex = Math.min(currentIndex, newMoves.length);
  }

  function savePgn(): void {
    const pgn = toPgn(moves);
    const blob = new Blob([pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game.pgn';
    a.click();
    URL.revokeObjectURL(url);
  }

  function flipBoard(): void {
    orientation = orientation === 'white' ? 'black' : 'white';
  }

  function confirmNewGame(): void {
    showNewGameWarning = false;
    onNewGame();
  }
</script>

<div class="flex flex-col min-h-screen bg-gray-950 text-slate-300">

  <header class="flex items-center gap-3 px-5 h-13 border-b border-white/5 bg-gray-950/90 backdrop-blur sticky top-0 z-20 shrink-0">
    <div class="flex items-center gap-2 mr-auto">
      <span class="text-xl">♟</span>
      <span class="text-sm font-semibold tracking-wide text-slate-100">Chess Journal</span>
    </div>

    {#if gameStatus}
      <span class="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full
        {gameStatus === 'Check!' ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 animate-pulse' : 'bg-red-500/10 text-red-300 border border-red-500/30'}">
        {gameStatus}
      </span>
    {:else}
      <span class="flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
        <span class="w-2 h-2 rounded-full shrink-0
          {activeTurnColor === 'white' ? 'bg-slate-100 shadow-[0_0_6px_white]' : 'bg-slate-700 border border-slate-500'}">
        </span>
        {activeTurnColor === 'white' ? 'White' : 'Black'} to move
      </span>
    {/if}

    <button
      onclick={flipBoard}
      class="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-colors"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
      </svg>
      Flip
    </button>
  </header>

  <main class="flex flex-1 items-start justify-center gap-4 p-5">

    <div class="flex flex-col items-center gap-3 shrink-0">
      <div class="rounded overflow-hidden shadow-[0_0_0_3px_#1e2130,0_0_0_4px_rgba(99,102,241,0.2),0_24px_64px_rgba(0,0,0,0.6)]">
        <Board
          fen={boardChess.fen()}
          {orientation}
          {lastMove}
          turnColor={activeTurnColor}
          dests={activeDests}
          check={activeCheck}
          {pendingPromotion}
          promotionColor={activeTurnColor ?? 'white'}
          onMove={handleMove}
          onPromotionChoice={handlePromotionChoice}
        />
      </div>
      <Controls onNext={nextMove} onPrev={prevMove} onFirst={firstMove} onLast={toLastMove} {currentIndex} totalMoves={moves.length} />
    </div>

    <aside class="w-56 shrink-0 flex flex-col rounded-xl border border-white/7 bg-white/[0.025] overflow-hidden self-stretch max-h-[calc(100vh-52px-2.5rem)]">
      <div class="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02] shrink-0">
        <span class="text-[0.6rem] font-bold tracking-[0.13em] uppercase text-slate-600">Move List</span>
        <span class="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {moves.length}
        </span>
      </div>
      <div class="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <MoveList
          {pairedMoves}
          {currentIndex}
          {notes}
          onGoToMove={goToMove}
          onNoteChange={(index, value) => (notes[index] = value)}
        />
      </div>

      <div class="shrink-0 flex flex-col gap-1.5 px-3 py-3 border-t border-white/5 bg-white/[0.015]">
        <button
          onclick={undoMove}
          disabled={moves.length === 0}
          class="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-medium rounded-md
            border border-white/8 bg-white/[0.03] text-slate-400
            hover:bg-white/8 hover:text-slate-200
            disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>
          </svg>
          Undo Last Move
        </button>
        <button
          onclick={savePgn}
          disabled={moves.length === 0}
          class="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-medium rounded-md
            border border-white/8 bg-white/[0.03] text-slate-400
            hover:bg-white/8 hover:text-slate-200
            disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Save PGN
        </button>
        <button
          onclick={() => showNewGameWarning = true}
          class="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-medium rounded-md
            border border-red-500/20 bg-red-500/5 text-red-400
            hover:bg-red-500/12 hover:text-red-300 hover:border-red-500/35 transition-colors"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
          </svg>
          New Game
        </button>
      </div>
    </aside>

  </main>
</div>

{#if showNewGameWarning}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="warning-title"
  >
    <div class="relative w-full max-w-md mx-4 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl">
      <div class="flex items-center gap-3 p-5 border-b border-gray-700">
        <div class="flex items-center justify-center w-9 h-9 rounded-full bg-red-950/60 border border-red-800/50 shrink-0">
          <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div>
          <h3 id="warning-title" class="text-base font-semibold text-white">Start a new game?</h3>
          <p class="text-xs text-gray-400 mt-0.5">This will take you back to the importer</p>
        </div>
      </div>

      <div class="px-5 py-4">
        <p class="text-sm text-gray-300">
          Your current game, moves, and notes will be <span class="text-red-400 font-medium">permanently lost</span>. This cannot be undone.
        </p>
      </div>

      <div class="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-700">
        <button
          onclick={() => showNewGameWarning = false}
          class="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onclick={confirmNewGame}
          class="px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-900 transition-colors"
        >
          Yes, new game
        </button>
      </div>

    </div>
  </div>
{/if}