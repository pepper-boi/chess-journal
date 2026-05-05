<script lang="ts">
  import Chess from "$lib/chess/Chess.svelte";
  import Importer from "$lib/chess/Importer.svelte";
  import 'chessground/assets/chessground.base.css';
  import 'chessground/assets/chessground.brown.css';
  import 'chessground/assets/chessground.cburnett.css';

  import type { VerboseMove } from "$lib/chess/logic";

  let importedMoves = $state<VerboseMove[] | null>(null);
</script>

{#if importedMoves !== null}
  <Chess importedMoves={importedMoves} onNewGame={() => importedMoves = null} />
{:else}
  <Importer onImport={(moves) => importedMoves = moves} />
{/if}