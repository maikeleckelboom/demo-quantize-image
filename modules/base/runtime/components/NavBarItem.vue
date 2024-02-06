<script lang="ts" setup>
import type { NavBarItem } from '~/modules/base/types'
import type { NuxtLink } from '#components'

const props = defineProps<{
  item: NavBarItem
  active: boolean
  hasLabel: boolean
}>()

const itemRef = ref<InstanceType<typeof NuxtLink>>()

function getIcon(item: NavBarItem) {
  if (!item.icon) return
  return isArray(item.icon) ? item.icon[props.active ? 1 : 0] : item.icon
}

const baseIcon = computed(() => {
  if (!props.item?.icon) return
  return isArray(props.item.icon) ? props.item.icon[0] : props.item.icon
})
const activeIcon = computed(() => props.item?.icon?.[1])

const isLarge = computed(() => props.item?.badge?.type === 'large')
</script>

<template>
  <NuxtLink ref="itemRef" :to="item.path" class="v-nav-item">
    <span class="v-state-indicator" />

    <Transition>
      <Icon v-if="active" :name="activeIcon" class="v-icon" />
      <Icon v-else :name="baseIcon" class="v-icon" />
    </Transition>
    <span v-if="item.badge" :class="{ 'v-large': isLarge }" class="v-badge">
      {{ isLarge ? item.badge.label : '' }}
    </span>
    <span v-if="hasLabel" class="v-label-text">{{ item.label }}</span>
  </NuxtLink>
</template>

<style lang="postcss" scoped>
.v-nav-item {
  --_row-gap: 4px;

  @screen md {
    --_row-gap: 8px;
  }

  display: grid;
  place-items: center;
  grid-template-columns: [icon state-indicator label badge] auto;
  grid-template-rows:
    [margin-top] 12px [icon state-indicator badge] 32px [row-gap] var(--_row-gap)
    [label] auto [margin-bottom] 16px;

  .v-state-indicator {
    transform: scaleX(0);
    transform-origin: center;
    opacity: 0.5;
    transition: all 160ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.router-link-active,
  &.router-link-exact-active {
    .v-state-indicator {
      transform: scaleX(1);
      opacity: 1;
    }

    .v-icon {
      color: rgb(var(--secondary-rgb));
    }

    .v-label-text {
      font-weight: 700;
    }
  }

  &:hover:not(.router-link-active):not(.router-link-exact-active) {
    .v-state-indicator {
      transform: scaleX(1);
      opacity: 1;
    }
  }

  &:focus-visible {
    .v-state-indicator {
      background: rgb(var(--secondary-rgb) / 0.3);
      transform: scaleX(0.98);
    }
  }

  &:not(:has(.v-label-text)) {
    grid-template-rows: [margin-top] 24px [icon state-indicator badge] 32px [margin-bottom] 24px;
  }
}

.v-label-text {
  grid-area: label;
  position: relative;
  z-index: 2;
  transition: font-weight 240ms ease-out;
  @apply text-label-sm;

  @screen md {
    @apply text-label-md;
  }
}

.v-state-indicator {
  height: 32px;
  min-width: 64px;
  border-radius: 16px;
  pointer-events: none;
  inset: 0;
  background: rgb(var(--secondary-container-rgb) / 0.38);
  grid-area: state-indicator;
}

.v-icon {
  grid-area: icon;
  height: 24px;
  width: 24px;
  z-index: 2;
  transition: color 140ms ease-out;
}

.v-badge {
  --large-size: 16px;
  --large-size-radius: 8px;
  --small-size: 6px;
  --small-size-radius: 3px;
  --size: var(--small-size);
  --radius: var(--small-size-radius);

  grid-area: badge;
  z-index: 3;

  block-size: var(--size);
  inline-size: var(--size);

  background: rgb(var(--error-rgb));
  border-radius: var(--radius);
  color: rgb(var(--on-error-rgb));
  position: relative;
  left: 14px;
  bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-transform: lowercase;

  &.v-large {
    --size: var(--large-size);
    --radius: var(--large-size-radius);
    width: calc(var(--size) * 1.75);
    height: var(--size);
    left: 12px;
    bottom: 4px;
  }

  @apply text-label-sm leading-none;
}
</style>
