<script generic="T extends TNavBarItem" lang="ts" setup>
import type { NavBarItem } from '#components'
import type { NavBarItem as TNavBarItem } from '~/modules/base/types'

const props = withDefaults(
  defineProps<{
    items?: T[]
    active?: T | null
    setActive?: (item: T) => void
    labelled?: boolean
  }>(),
  {
    active: null,
    labelled: true,
    items: () => [],
    setActive: () => {}
  }
)

const isActive = (item: T) => item === props.active

const itemsCount = computed(() => props.items.length)
</script>

<template>
  <div class="v-nav-bar">
    <div class="v-nav-bar-container">
      <NavBarItem
        v-for="item in items"
        :key="item.label"
        :active="isActive(item)"
        :has-label="labelled"
        :item="item"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.v-nav-bar {
  --_items-count: v-bind(itemsCount);
  max-width: 100svw;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  height: 80px;
}

.v-nav-bar-container {
  display: grid;
  grid-template-columns: repeat(var(--_items-count), 1fr);
  background-color: rgb(var(--surface-container-rgb));
  column-gap: 8px;
  max-width: 600px;
  margin-inline: auto;
  height: 100%;

  @appy max-w-2xl mx-auto relative;
}
</style>
