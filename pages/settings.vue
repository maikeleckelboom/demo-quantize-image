<script lang="ts" setup>
const { isLabelled, toggleLabelled } = useNavStore()

const { contrastLevel, isDark } = useThemeConfig()
</script>

<template>
  <div class="mx-auto w-full max-w-xl p-4">
    <h1>Settings</h1>
    <form>
      <fieldset>
        <legend>Color Mode</legend>
        <div class="grid grid-cols-[100px,1fr]">
          <div>
            <label for="dark-toggle"> Switch to {{ isDark ? 'light' : 'dark' }} </label>
          </div>
          <div class="flex justify-center">
            <DarkToggle v-slot="{ toggle, isDark }">
              <button type="button" @click="toggle">
                <Icon v-if="isDark.value" class="size-6" name="ic:round-light-mode" />
                <Icon v-else class="size-6" name="ic:round-dark-mode" />
              </button>
            </DarkToggle>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Contrast Level</legend>
        <div>
          <ContrastSlider id="contrast-level" v-model="contrastLevel" />
        </div>
      </fieldset>
      <!-- Navigation Bar -->
      <fieldset class="flex flex-col gap-8">
        <legend>Navigation Bar</legend>
        <div class="grid grid-cols-[100px,1fr]">
          <div>
            <label for="labelled">Show Labels</label>
          </div>
          <div class="flex justify-center">
            <input id="labelled" v-model="isLabelled" type="checkbox" @change="toggleLabelled" />
          </div>
        </div>
        <div class="grid grid-cols-[140px,1fr]">
          <div>
            <label for="">Background Color</label>
          </div>
          <div class="flex justify-center">
            <!-- -->
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
h1 {
  @apply mb-4 text-headline-md;
}

form {
  display: grid;
  gap: 1rem;
}

fieldset {
  border: 1px solid rgb(var(--surface-variant-rgb));
  padding: 1rem;
}

legend {
  @apply text-label-lg;
}

input[type='checkbox'] {
  @apply size-[16px];
}
</style>
