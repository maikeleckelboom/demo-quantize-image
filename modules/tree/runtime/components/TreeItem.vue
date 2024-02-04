<script lang="ts" setup>
import { type ExcludeKeys, hasChildren, type MenuItem } from '~/modules/tree/types'

type ClassInput = string | string[] | Record<string, boolean>

withDefaults(
  defineProps<{
    item: MenuItem
    as?: string
    exclude?: ExcludeKeys[]
    openIcon?: string
    closeIcon?: string
    iconClass?: ClassInput
    textClass?: ClassInput
  }>(),
  {
    as: 'button',
    openIcon: 'ic:round-expand-more',
    closeIcon: 'ic:round-expand-less',
    iconClass: 'size-4',
    textClass: 'select-none leading-none'
  }
)

defineSlots<{
  leading: () => any
  trailing: () => any
  default: ({ item }: { item: MenuItem }) => any
}>()
</script>

<template>
  <Component :is="$props.as">
    <slot name="leading" />
    <template v-if="hasChildren(item) && !exclude?.includes('toggle-icon')">
      <Icon v-if="item.open" :class="$props.iconClass" :name="openIcon" />
      <Icon v-else :class="$props.iconClass" :name="closeIcon" />
    </template>
    <template v-if="item.leadingIcon && !exclude?.includes('leading-icon')">
      <Icon :class="$props.iconClass" :name="item.leadingIcon" />
    </template>
    <slot :item="item">
      <span :class="$props.textClass" class="leading-none">{{ item.label }}</span>
    </slot>
    <template v-if="item.trailingIcon && !exclude?.includes('trailing-icon')">
      <Icon :class="$props.iconClass" :name="item.trailingIcon" />
    </template>
    <template v-if="item.trailingText && !exclude?.includes('trailing-text')">
      <span>{{ item.trailingText }}</span>
    </template>
    <template v-if="item.shortcuts?.length && !exclude?.includes('shortcuts')">
      <KeyboardShortcut :shortcuts="item.shortcuts" />
    </template>
    <slot name="trailing" />
  </Component>
</template>

<style scoped></style>
