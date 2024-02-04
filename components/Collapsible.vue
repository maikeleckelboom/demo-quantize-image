<script lang="ts" setup>
const transitionDuration = ref<string>('400ms')
const transitionDelay = ref<string>('150ms')
const transitionTotalDuration = computed<number>(
  () => parseInt(unref(transitionDuration)) + parseInt(unref(transitionDelay))
)
const modelValue = defineModel<boolean>('modelValue', { type: Boolean, default: false })
</script>

<template>
  <div
    :aria-expanded="modelValue"
    class="v-collapsible flex flex-col space-y-1.5"
    data-collapsible
  >
    <div class="v-collapsible-trigger" data-collapsible-trigger>
      <slot name="trigger" />
    </div>
    <Transition :duration="transitionTotalDuration" name="collapsible">
      <div
        v-show="modelValue"
        key="content"
        class="v-collapsible-content"
        data-collapsible-content
      >
        <div>
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.v-collapsible {
  --transition-duration: v-bind(transitionDuration);
  --transition-delay: v-bind(transitionDelay);

  transition-property: grid-template-rows;
  transition-duration: var(--transition-duration);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  display: grid;
  place-content: start;
  grid-template-rows: auto 0fr;
  grid-template-columns: 1fr;

  &[aria-expanded='true'] {
    grid-template-rows: auto 1fr;
  }

  .v-collapsible-content {
    overflow: hidden;
    min-inline-size: 100%;
  }

  .collapsible-enter-active *,
  .collapsible-leave-active * {
    transition-duration: var(--transition-duration);
    transition-property: transform, opacity;
  }

  .collapsible-enter-from *,
  .collapsible-leave-to * {
    opacity: 0;
  }

  .collapsible-leave-active {
    transition-delay: var(--transition-delay);
  }

  .collapsible-enter-active * {
    transition-delay: var(--transition-delay);
  }
}
</style>
