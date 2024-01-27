<script lang="ts" setup>
const emojis = ref<string[]>(['😀', '😞', '🤷', '💥', '🦸', '👋', '💖'])


</script>

<template>
  <div class="mx-auto size-full max-w-7xl">
    <h1 class="text-display-lg">
      Welcome to .. <span class="text-display-sm font-mono text-primary">de index pagina </span> ..
    </h1>
  <div class="flex flex-col">
    <div>
      <ul>
        <li v-for="emoji in emojis" :key="emoji">{{ emoji }}</li>
      </ul>
    </div>
    <div>
      <button @click="emojis.push('👍')">Add 👍</button>
    </div>
  </div>
  </div>
</template>

<style scoped>

</style>
