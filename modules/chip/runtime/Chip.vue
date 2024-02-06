<script lang="ts" setup>
type ChipProps = {
  variant?: 'assist' | 'filter' | 'input' | 'suggestion'
  icon?: string
  selected?: boolean
}

withDefaults(defineProps<ChipProps>(), {
  variant: 'filter',
  selected: false
})

defineSlots<{
  default(): void
}>()

const root = ref<HTMLElement>()

const transitionDuration = ref<string>('240ms')
const transitionDelay = ref<string>('160ms')
const transitionTotalDuration = computed<number>(
  () => parseInt(unref(transitionDuration)) + parseInt(unref(transitionDelay))
)
</script>

<template>
  <div
    ref="root"
    :class="{
      selected
    }"
    :data-variant="variant"
    :data-with-icon="true"
    class="chip"
  >
    <span>
      <Transition :duration="transitionTotalDuration" name="chip">
        <Icon key="check" class="v-icon icon" name="ic:round-check" />
      </Transition>
    </span>
    <span class="label-text">
      <slot />
    </span>
  </div>
</template>

<style scoped>
.chip {
  --_transition-duration: v-bind(transitionDuration);
  --_transition-delay: v-bind(transitionDelay);
  --_icon-color: rgb(var(--on-surface-rgb));
  --_icon-color-selected: rgb(var(--primary-rgb));
  --_outline-color: rgb(var(--outline-variant-rgb));
  --_text-color: rgb(var(--on-surface-rgb));

  --_height: 32px;
  --_border-radius: 6px;
  --_icon-size: 18px;
  --_padding: 16px;
  --_padding-with-icon: 8px;
  --_padding-between-elements: 8px;

  position: relative;
  height: var(--_height);
  border-radius: var(--_border-radius);
  background-color: var(--_background-color);
  color: var(--_text-color);

  outline: 1px solid var(--_outline-color);

  padding-block: 0;
  text-align: center;
  user-select: none;
  padding-inline: var(--_padding);
  display: grid;

  align-items: center;
  grid-template-columns: 0 1fr;
  grid-template-rows: 1fr;
  place-content: start;
  width: fit-content;
  @apply text-label-lg;

  transition:
    grid-template-columns var(--_transition-duration) ease,
    outline-color calc(var(--_transition-duration) * 1) ease,
    background-color var(--_transition-duration),
    text-shadow var(--_transition-duration);

  .v-icon {
    width: var(--_icon-size);
    height: var(--_icon-size);
    color: var(--_icon-color);
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%) scale(0);
    opacity: 0;
    transition-duration: calc(var(--_transition-duration) * 0.6);
    transition-property: transform, opacity;
    transition-timing-function: ease-out;
    transition-delay: 0ms;
  }

  &.selected {
    --_background-color: rgb(var(--surface-tint-rgb) / 0.26);
    --_text-color: rgb(var(--on-surface-rgb));
    --_outline-color: rgb(var(--surface-tint-rgb) / 0.26);
    --_icon-color: rgb(var(--primary-rgb));

    gap: var(--_padding-between-elements);
    grid-template-columns: calc(var(--_icon-size) + 1px) 1fr;
    text-shadow: 0 1px 0 rgb(var(--on-surface-rgb) / 0.15);
    padding-inline-start: var(--_padding-with-icon);

    .icon {
      transform: translateY(-50%) scale(1);
      transition-delay: var(--_transition-delay);
      opacity: 1;
    }
  }

  &:not(.v-mobile-or-tablet &):hover {
    --_background-color: rgb(var(--surface-tint-rgb) / 0.13);
    --_text-color: rgb(var(--on-surface-rgb));
    --_icon-color: rgb(var(--primary-rgb));
  }
}
</style>
