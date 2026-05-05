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
  {value}
  oninput={(e) => onChange(e.currentTarget.value)}
  placeholder="Add a note…"
  rows={2}
  class="w-full box-border text-[0.75rem] leading-relaxed font-sans
    bg-yellow-500/5 border border-yellow-500/15 border-l-2 border-l-yellow-500/35
    rounded-r text-yellow-600 placeholder-yellow-700/30
    px-2 py-1.5 my-0.5 resize-none min-h-[52px] outline-none
    focus:bg-yellow-500/8 focus:border-yellow-500/25 focus:border-l-yellow-500/55
    transition-colors"
></textarea>