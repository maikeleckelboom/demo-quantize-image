<script lang="ts" setup>
const transitionDuration = ref<string>('400ms')
const transitionDelay = ref<string>('150ms')
const transitionTotalDuration = computed<number>(
  () => parseInt(unref(transitionDuration)) + parseInt(unref(transitionDelay))
)
const modelValue = defineModel<boolean>('modelValue', { type: Boolean, default: false })

const id = useId()
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
        <div class="v-collapsible-content-inner">
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
    transition-delay: 0ms;
  }

  &[aria-expanded='false'] {
    transition-delay: var(--transition-delay);
  }

  .v-collapsible-content {
    overflow: hidden;
    min-inline-size: 100%;
  }

  .collapsible-enter-active .v-collapsible-content-inner,
  .collapsible-leave-active .v-collapsible-content-inner {
    transition-duration: var(--transition-duration);
    transition-property: opacity, transform;
  }

  .collapsible-enter-from .v-collapsible-content-inner,
  .collapsible-leave-to .v-collapsible-content-inner {
    opacity: 0;
    transform: translateY(-4px);
  }

  .collapsible-enter-active .v-collapsible-content-inner {
    transition-delay: var(--transition-delay);
  }
}
</style>
