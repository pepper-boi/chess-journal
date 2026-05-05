<script lang="ts">
  import { parsePgn, type VerboseMove } from './logic';

  let { onImport }: { onImport: (moves: VerboseMove[]) => void } = $props();

  let pgnText = $state('');
  let isDragOver = $state(false);
  let error = $state('');
  let fileInput: HTMLInputElement;

  function readFile(file: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      pgnText = (e.target?.result as string) ?? '';
      error = '';
    };
    reader.readAsText(file);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragOver = true;
  }
  function handleDragLeave() {
    isDragOver = false;
  }
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) readFile(file);
  }

  function handleFileChange(e: Event) {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (file) readFile(file);
  }

  function handleImport() {
    error = '';
    if (!pgnText.trim()) {
      error = 'Please provide a PGN — upload a file or paste text.';
      return;
    }
    try {
      const moves = parsePgn(pgnText);
      if (moves.length === 0) {
        error = 'No moves found in the PGN.';
        return;
      }
      onImport(moves);
    } catch {
      error = 'Invalid PGN. Please check the format and try again.';
    }
  }

  function handleManualEntry() {
    onImport([]);
  }
</script>

<div class="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 gap-8 text-gray-100">

  <div class="text-center">
    <div class="flex items-center justify-center gap-3 mb-2">
      <span class="text-4xl">♟</span>
      <h1 class="text-3xl font-bold text-white">Chess Journal</h1>
    </div>
    <p class="text-sm text-gray-400">Import a PGN to study your game, or start fresh</p>
  </div>

  <div class="w-full max-w-4xl flex flex-col gap-5">

    <div class="grid md:grid-cols-2 gap-5">

      <div
        class="flex flex-col rounded-lg border bg-gray-800 shadow-sm transition-colors
          {isDragOver ? 'border-blue-500 bg-gray-700' : 'border-gray-700'}"
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        role="region"
        aria-label="PGN file upload area"
      >
        <div class="flex items-center justify-between p-4 border-b border-gray-700 rounded-t-lg bg-gray-800/60">
          <h2 class="text-base font-semibold text-white">Upload PGN File</h2>
        </div>

        <div class="flex flex-col items-center justify-center p-8 gap-4 text-center flex-1">
          <div class="flex items-center justify-center w-14 h-14 rounded-full bg-gray-700">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-300">
              {isDragOver ? 'Drop it here!' : 'Drag and drop your .pgn file'}
            </p>
            <p class="text-xs text-gray-500 mt-1">or click to browse</p>
          </div>

          <input
            bind:this={fileInput}
            type="file"
            accept=".pgn,text/plain"
            class="hidden"
            onchange={handleFileChange}
          />

          <button
            type="button"
            onclick={() => fileInput.click()}
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-800 transition-colors"
          >
            Browse files
          </button>
        </div>
      </div>

      <div class="flex flex-col rounded-lg border border-gray-700 bg-gray-800 shadow-sm">
        <div class="flex items-center p-4 border-b border-gray-700 rounded-t-lg bg-gray-800/60">
          <h2 class="text-base font-semibold text-white">Paste PGN Text</h2>
        </div>
        <div class="p-4 flex-1">
          <textarea
            bind:value={pgnText}
            placeholder={'[Event "Casual"]\n[White "Player 1"]\n[Black "Player 2"]\n[Result "1-0"]\n\n1. e4 e5 2. Nf3 Nc6 ...'}
            spellcheck="false"
            rows={9}
            class="block w-full p-3 text-sm font-mono text-gray-100 bg-gray-700 rounded-lg border border-gray-600 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          ></textarea>
        </div>
      </div>

    </div>

    {#if error}
      <div class="flex items-center gap-3 p-4 text-sm text-red-400 rounded-lg bg-red-950/50 border border-red-800/60" role="alert">
        <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        <span>{error}</span>
      </div>
    {/if}

    <div class="flex items-center justify-center gap-3">
      <button
        type="button"
        onclick={handleManualEntry}
        class="px-5 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-700 transition-colors"
      >
        Start blank game
      </button>
      <button
        type="button"
        onclick={handleImport}
        class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-800 transition-colors"
      >
        Import &amp; study
      </button>
    </div>

  </div>
</div>