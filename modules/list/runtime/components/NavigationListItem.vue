<script generic="TItem extends NavigationListItem" lang="ts" setup>
import type { NavigationListItem } from '~/modules/list/types'

const {
  item,
  level = 0,
  activeClass,
  exactActiveClass,
  onClicked = () => {}
} = defineProps<{
  item: TItem
  level?: number
  activeClass?: string
  exactActiveClass?: string
  onClicked?: (event: MouseEvent, item: TItem) => void
}>()

function isLink<T>(item: T): item is T extends NavigationListItem ? T : never {
  return (item as NavigationListItem).href !== undefined
}

function isRecursive<T>(item: T): item is T extends NavigationListItem ? T : never {
  return (
    (item as NavigationListItem).children !== undefined &&
    (item as NavigationListItem).children.length > 0
  )
}

defineSlots<{
  default({ item, level }: { item: TItem; level: number }): any
  children({ item, level }: { item: TItem; level: number; labelledBy?: string }): any
}>()

const triggerLabel = computed<string>(() => {
  if (isRecursive(item)) {
    return `${slugify(item.label)}-${level}`
  }
})

const baseItemClass = computed<string | string[]>(
  () =>
    <string | string[]>(
      `rounded border border-transparent focus-visible:border-primary focus-visible:bg-primary-container/10 focus-visible:outline-none`
    )
)
</script>

<template>
  <li :aria-expanded="isRecursive(item) ? item.open : undefined">
    <NuxtLink
      v-if="isLink(item)"
      :active-class="activeClass"
      :class="baseItemClass"
      :exact-active-class="exactActiveClass"
      :to="item.href"
    >
      <slot :item="<TItem>item" :level="level">
        {{ item.label }}
      </slot>
    </NuxtLink>
    <template v-if="isRecursive(item)">
      <button
        :id="triggerLabel"
        :aria-controls="`${triggerLabel}-panel`"
        :class="{
          [Array.isArray(baseItemClass) ? baseItemClass.join(' ') : baseItemClass]: true,
          [activeClass]: item?.children?.some((child) => child.href === $route.path)
        }"
        class="size-full"
        @click="onClicked($event, <TItem>item)"
      >
        <slot :item="<TItem>item" :level="level"></slot>
      </button>
      <slot :item="<TItem>item" :labelledBy="triggerLabel" :level="level" name="children" />
    </template>
  </li>
</template>
