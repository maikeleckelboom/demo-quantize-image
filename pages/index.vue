<script lang="ts" setup>
const emojiArray = ref<string[]>(['😀', '😞', '🤷', '💥', '🦸', '👋', '💖'])

</script>

<template>
  <div class="mx-auto size-full max-w-4xl px-8 md:px-14">
    <h1 class="text-display-lg mb-4">
      Welcome to .. <span class="text-display-sm font-mono text-primary">de index pagina </span> ..
    </h1>
    <div class="grid md:grid-cols-2">
      <div class="flex flex-col gap-y-4">
        <div>
          <ul class="list-decimal list-inside">
            <li v-for="emoji in emojiArray" :key="emoji">{{ emoji }}</li>
          </ul>
        </div>
        <div>
          <button class="outlined-button" @click="emojiArray.push('👍')">Add 👍</button>
        </div>
      </div>
      <div>
        <KeyColorPickers />
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.outlined-button {
  @apply relative size-fit overflow-clip rounded-3xl px-6 py-3 bg-transparent border border-primary;
  @apply leading-none text-center text-label-lg font-medium;
  @apply after:absolute after:bg-transparent after:inset-0 after:z-0;
  @apply hover:after:bg-surface-level-1 focus-visible:after:bg-surface-level-3 active:after:bg-surface-level-2;
}
</style>
