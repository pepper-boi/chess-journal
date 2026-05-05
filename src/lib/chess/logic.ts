import { Chess, type Square } from 'chess.js';
import type { Color, Key } from 'chessground/types';

export type PromotionPiece = 'q' | 'r' | 'b' | 'n';
export type VerboseMove = { san: string; from: string; to: string; promotion?: string };

export function toDests(chess: Chess): Map<Key, Key[]> {
  const dests = new Map<Key, Key[]>();
  for (const square of chess.board().flat()) {
    if (!square || square.color !== chess.turn()) continue;
    const moves = chess.moves({ square: square.square as Square, verbose: true });
    if (moves.length) {
      dests.set(square.square as Key, moves.map(m => m.to as Key));
    }
  }
  return dests;
}

export function turnColor(chess: Chess): Color {
  return chess.turn() === 'w' ? 'white' : 'black';
}

export function isPromotion(chess: Chess, orig: Key, dest: Key): boolean {
  const piece = chess.get(orig as Square);
  return (
    piece?.type === 'p' &&
    ((piece.color === 'w' && dest[1] === '8') ||
      (piece.color === 'b' && dest[1] === '1'))
  );
}

export function getGameStatus(chess: Chess): string {
  if (chess.isCheckmate()) return 'Checkmate';
  if (chess.isStalemate()) return 'Stalemate';
  if (chess.isDraw()) return 'Draw';
  if (chess.isCheck()) return 'Check!';
  return '';
}

export function getMoveCount(chess: Chess): number {
  return chess.history().length;
}

export function pairMoves(history: { san: string }[]) {
  const pairs = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({ n: Math.floor(i / 2) + 1, white: history[i], black: history[i + 1] });
  }
  return pairs;
}

export function parsePgn(pgn: string): VerboseMove[] {
  const c = new Chess();
  c.loadPgn(pgn.trim());
  return c.history({ verbose: true }).map(m => ({
    san: m.san,
    from: m.from,
    to: m.to,
    promotion: m.promotion,
  }));
}

export function toPgn(moves: VerboseMove[]): string {
  const c = new Chess();
  for (const m of moves) {
    c.move({ from: m.from as Square, to: m.to as Square, promotion: m.promotion });
  }
  return c.pgn();
}