<script lang="ts">
  let {
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  } = $props();
</script>

<textarea
  class="note-input"
  {value}
  oninput={(e) => onChange(e.currentTarget.value)}
  placeholder="Click to write..."
  rows="1"
></textarea>

<style>
  textarea.note-input {
    width: 100%;
    font-size: 0.8rem;
    color: var(--text, #ccc);

    background: rgba(201, 168, 76, 0.08);
    border-left: 2px solid rgba(201, 168, 76, 0.5);
    border-top: none;
    border-right: none;
    border-bottom: none;

    /* padding: 0.4rem 0.5rem; */
    /* margin: 0.25rem 0; */
    line-height: 1.5;

    resize: none;
    box-sizing: border-box;
    min-height: 4rem;

    /* white-space: pre-wrap; */
  }

  textarea.note-input:focus {
    outline: none;
    background: rgba(201, 168, 76, 0.12);
    border-left: 2px solid rgba(201, 168, 76, 0.7);
  }

  textarea.note-input::placeholder {
    color: rgba(200, 200, 200, 0.5);
  }
</style>