<script lang="ts" setup>
const emojiArray = ref<string[]>(['😀', '😞', '🤷', '💥', '🦸', '👋', '💖'])
</script>

<template>
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
</template>

<style scoped>

</style>
