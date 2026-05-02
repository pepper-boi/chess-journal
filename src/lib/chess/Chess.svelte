<script lang="ts">
  import { Chess, type Square } from 'chess.js';
  import type { Color, Key } from 'chessground/types';
  import Board from './Board.svelte';
  import MoveList from './MoveList.svelte';
  import { toDests, turnColor, isPromotion, pairMoves, type PromotionPiece } from './logic';
	import Controls from './Controls.svelte';

  type VerboseMove = { san: string; from: string; to: string; promotion?: string };

  let orientation: Color = $state('white');
  let currentIndex: number = $state(0);
  let moves: VerboseMove[] = $state([]);
  let notes: Record<number, string> = $state({});
  let pendingPromotion: { orig: Key; dest: Key } | null = $state(null);

  let chess = new Chess();

  // Best way I could find to get reactive chess state 
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
  let lastMove = $derived(
    currentIndex > 0
      ? [moves[currentIndex - 1].from, moves[currentIndex - 1].to] as [Key, Key]
      : undefined
  );
  let pairedMoves = $derived(pairMoves(moves));

  function applyMove(orig: Key, dest: Key, promotion?: PromotionPiece): void {
    const result = chess.move({ from: orig as Square, to: dest as Square, promotion });
    moves = [...moves.slice(0, currentIndex), result as VerboseMove];
    currentIndex = moves.length;
  }

  function handleMove(orig: Key, dest: Key): void {
    if (isPromotion(chess, orig, dest)) {
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
    // Rebuild the mutable chess instance to match the displayed position
    chess = new Chess();
    for (const m of moves.slice(0, index)) {
      chess.move({ from: m.from as Square, to: m.to as Square, promotion: m.promotion });
    }
  }
  
  function nextMove(): void {
    if (currentIndex < moves.length) {
      goToMove(currentIndex + 1);
    }
  }

  function prevMove(): void {
    if (currentIndex > 0) {
      goToMove(currentIndex - 1);
    }
  }
</script>

<div class="board-shell">
  <div class="board-col">
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
    <Controls onNext={nextMove} onPrev={prevMove} currentIndex={currentIndex} totalMoves={moves.length}/>
  </div>
  <MoveList
    {pairedMoves}
    {currentIndex}
    {notes}
    onGoToMove={goToMove}
    onNoteChange={(index, value) => notes[index] = value}
  />
</div>

<style>
  .board-shell {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .board-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }
</style>