<script lang="ts" setup>
import type { NavBarItem } from '~/modules/base/types'
import type { NuxtLink } from '#components'

const props = defineProps<{
  item: NavBarItem
  active: boolean
}>()

const itemRef = ref<InstanceType<typeof NuxtLink>>()

/*

const { focused } = useFocus(itemRef, {
  focusVisible: true
})

const hovered = useElementHover(unrefElement(itemRef))
*/

function getIcon(item: NavBarItem) {
  if (!item.icon) return
  return isArray(item.icon) ? item.icon[props.active ? 1 : 0] : item.icon
}

const stateClasses = computed(() => ({}))
</script>

<template>
  <NuxtLink ref="itemRef" :to="item.path" class="v-nav-item">
    <span class="v-state-indicator" />
    <Icon :name="getIcon(item)" class="v-icon" />
    <span class="v-label-text">{{ item.label }}</span>
  </NuxtLink>
</template>

<style scoped>
.v-nav-item {
  display: grid;
  place-items: center;
  --_row-gap: 4px;

  @screen md {
    --_row-gap: 8px;
  }

  grid-template-columns: [icon state-indicator label badge] auto;
  grid-template-rows:
    [margin-top] 12px [icon state-indicator badge] 32px [row-gap] var(--_row-gap)
    [label] auto [margin-bottom] 12px;

  &.router-link-active,
  &.router-link-exact-active {
    .v-state-indicator {
      transform: scale(1);
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
      transform: scale(0.9);
    }
  }

  &:focus-visible {
    .v-state-indicator {
      background: rgb(var(--secondary-rgb) / 0.2);
      transform: scale(0.95);
    }
  }
}

.v-icon {
  grid-area: icon;
  height: 24px;
  width: 24px;
  z-index: 2;
}

.v-label-text {
  grid-area: label;
  position: relative;
  z-index: 2;
  transition: font-weight 300ms ease-out;
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
  transform: scale(0);
  transition: transform 240ms ease-out;
}
</style>
