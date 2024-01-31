<script lang="ts" setup>
type ChipProps = {
  variant?: 'assist' | 'filter' | 'input' | 'suggestion'
  icon?: string
  selectedIcon?: string
  selected?: boolean
}

const props = withDefaults(defineProps<ChipProps>(), {
  variant: 'filter',
  selected: false
})

const slots = defineSlots<{
  default(): void
}>()

const root = ref<HTMLElement>()

const transitionDuration = ref<number>(320)
const transitionDelay = ref<number>(160)
const transitionTotalDuration = computed<number>(() => unref(transitionDuration) + unref(transitionDelay))
</script>

<template>
  <div
    ref="root"
    :class="{
      selected
    }"
    :data-variant="variant"
    :data-with-icon="!!selectedIcon"
    class="chip-root"
  >
    <Transition :duration="transitionDuration" name="chip">
      <span v-if="selectedIcon" class="box-control">
        <Icon :name="selectedIcon" class="icon" />
      </span>
    </Transition>
    <slot />
  </div>
</template>

<style>
.chip-root {
  --_transition-duration: v-bind(transitionDuration);
  --_transition-delay: v-bind(transitionDelay);
  --_height: 32px;
  --_border-radius: 8px;

  --_icon-size: 18px;
  --_icon-color: rgb(var(--on-surface-rgb));
  --_icon-color-selected: rgb(var(--primary-rgb));

  --_padding: 16px;
  --_padding-with-icon: 8px;
  --_padding-between-elements: 8px;

  --_outline-color: rgb(var(--outline-rgb));
  --_text-color: rgb(var(--on-surface-rgb));

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
  @apply text-label-lg font-medium;

  transition: grid-template-columns 200ms ease-out;
  position: relative;

  .icon {
    width: var(--_icon-size);
    height: var(--_icon-size);
    color: var(--_icon-color);
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%) scale(0);
    opacity: 0;
    transition: ease all 200ms;
    transition-delay: 50ms;
  }

  .box-control {
    overflow: hidden;
  }

  &.selected {
    --_background-color: rgb(var(--surface-tint-rgb) / 0.26);
    --_text-color: rgb(var(--on-surface-rgb));
    --_outline-color: rgb(var(--surface-tint-rgb) / 0.26);
    --_icon-color: rgb(var(--primary-rgb));

    grid-template-columns: calc(var(--_icon-size) + 1px) 1fr;

    gap: 8px;
    padding-inline-start: var(--_padding-with-icon);

    .icon {
      transform: translateY(-50%) scale(1);
      opacity: 1;
      transition-delay: 0ms;
    }
  }
}
</style>
