<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let { onNext, onPrev, currentIndex, totalMoves } = $props();

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onNext();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onPrev();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>
<div>
  <button class="nav-btn" onclick={onPrev} disabled={currentIndex === 0}>◂</button>
  <button class="nav-btn" onclick={onNext} disabled={totalMoves === 0 || currentIndex >= totalMoves}>▸</button>
</div>
<style>
  .nav-btn {
    background: rgba(201, 168, 76, 0.08);
    border: 1px solid rgba(201, 168, 76, 0.25);
    color: rgba(201, 168, 76, 0.85);
    border-radius: 3px;
    width: 5rem;
    height: 5rem;
    font-size: 3rem;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .nav-btn:hover:not(:disabled) {
    background: rgba(201, 168, 76, 0.18);
    border-color: rgba(201, 168, 76, 0.55);
    transform: translateY(-1px);
  }

  .nav-btn:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
</style>