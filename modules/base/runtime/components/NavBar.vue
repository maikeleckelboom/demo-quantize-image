<script generic="T extends TNavBarItem" lang="ts" setup>
import type { NavBarItem } from '#components'
import type { NavBarItem as TNavBarItem } from '~/modules/base/types'

const props = withDefaults(
  defineProps<{
    items?: T[]
    active?: T | null
    setActive?: (item: T) => void
  }>(),
  {
    active: null,
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
        :item="item"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.v-nav-bar {
  --items-count: v-bind(itemsCount);
  height: auto;
  max-width: 100svw;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
}

.v-nav-bar-container {
  display: grid;
  grid-template-columns: repeat(var(--items-count), 1fr);
  background-color: rgb(var(--surface-container-rgb));
  column-gap: 8px;
  max-width: 600px;
  margin-inline: auto;
  height: 100%;
  box-shadow: 0 4px 5px -3px rgb(var(--error-container-rgb) / 0.3);

  @appy max-w-2xl mx-auto relative;
}
</style>
