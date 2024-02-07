<script lang="ts" setup>
const transitionDuration = ref<string>('400ms')
const transitionDelay = ref<string>('200ms')
const transitionTotalDuration = computed<number>(
  () => parseInt(unref(transitionDuration)) + parseInt(unref(transitionDelay))
)
const modelValue = defineModel<boolean>('modelValue', { type: Boolean, default: false })
const id = useId()
</script>

<template>
  <div :id="id" :aria-expanded="modelValue" class="v-collapsible flex flex-col">
    <div class="v-collapsible-trigger">
      <slot name="trigger" />
    </div>
    <Transition :duration="transitionTotalDuration" name="collapsible">
      <div v-if="modelValue" key="content" class="v-collapsible-content">
        <div class="v-collapsible-content-inner">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.v-collapsible {
  --_duration: v-bind(transitionDuration);
  --_delay: v-bind(transitionDelay);

  transition-property: grid-template-rows;
  transition-duration: var(--_duration);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  display: grid;
  place-content: start;
  grid-template-rows: auto 0fr;
  grid-template-columns: 1fr;

  &[aria-expanded='true'] {
    grid-template-rows: auto 1fr;

    .v-collapsible-content {
    }
  }

  &[aria-expanded='false'] {
    transition-delay: var(--_delay);
  }

  .v-collapsible-content {
    overflow: hidden;

    min-inline-size: 100%;
  }

  .collapsible-enter-from,
  .collapsible-leave-to {
    opacity: 0;
    transform: translateY(-2px);
  }

  .collapsible-enter-active,
  .collapsible-leave-active {
    transition-duration: var(--_duration);
    transition-property: opacity, transform;
  }
}
</style>
