<script generic="T extends MenuItem" lang="ts" setup>
import { type ExcludeKeys, hasChildren, isSelectable, type MenuItem } from '~/modules/tree/types'
import { twMerge } from 'tw-merge'

defineSlots<{
  default({ item }: { item: T; level: number }): any
  item({ item }: { item: T; level: number }): any
}>()

const props = withDefaults(
  defineProps<{
    list: T[]
    level?: number
    indent?: number | false
    static?: boolean
    exclude?: ExcludeKeys[]
    headerClass?: (item: T, level: number) => string
    transitionName?: string
    transitionDuration?: number
  }>(),
  {
    list: () => [],
    level: 1,
    indent: 12,
    static: false,
    headerClass: () => '',
    transitionName: 'tree',
    transitionDuration: 320
  }
)

function onClick(event: Event, item: T) {
  if (item?.onClick !== undefined) {
    item.onClick()
  }

  if (!hasChildren(item)) {
    return
  }

  item.open = !item.open
}

function onSelect(event: Event, item: T, option: T) {
  if (item.multiple) {
    handleMultipleSelection(event, item, option)
    return
  }

  handleSingleSelection(event, item, option)
}

function handleMultipleSelection(event: Event, item: T, option: T) {
  if (item.minSelections === 1) {
    option.selected = true
    return
  }
  option.selected = !option.selected
}

function handleSingleSelection(event: Event, item: T, option: T) {
  const { children, minSelections } = item
  if (minSelections === 1) {
    // Check if the option is already selected
    if (option.selected) {
      event.preventDefault()
      return
    }

    // Unselect all other options
    children.forEach((opt) => {
      opt.selected = opt === option
    })

    // Prevent unselecting the only option
    option.selected = true
    return
  }

  children.forEach((opt) => {
    opt.selected = opt === option ? !opt.selected : false
  })
}

function getIndent() {
  if (props.indent === false) {
    return 0
  }
  return props.indent * props.level
}

function getDisabled(item: T): boolean {
  return item.disabled || false
}

function getName(item: T): string {
  item.name ??= slugify(item.label)
  return item.name
}

const isAlwaysOpen = computed<boolean>(() => !!props.static)

const indentStyles = computed<Record<string, string>>(() => {
  if (props.indent === false) {
    return {}
  }
  return {
    paddingLeft: `${getIndent()}px`
  }
})

const transitionDelay = computed<number>(() => interpolate(props.transitionDuration))
const transitionTotalDuration = computed<number>(
  () => props.transitionDuration + transitionDelay.value
)

const transitionStyles = computed<Record<string, string>>(() => ({
  '--transition-delay': `${transitionDelay.value}ms`,
  '--transition-duration': `${props.transitionDuration}ms`
}))

const treeListItemClass = twMerge(
  'flex items-center justify-start gap-x-1.5 px-2 py-2 hover:bg-surface-level-1 focus-visible:bg-surface-level-2 active:bg-surface-level-3'
)
</script>

<template>
  <ul
    :role="level === 1 ? 'tree' : 'group'"
    :style="transitionStyles"
    class="tree"
    :class="[level === 1 ? 'root-node' : '']"
  >
    <li
      v-for="(item, idx) in list"
      :key="getName(item)"
      :aria-expanded="hasChildren(item) ? item.open : undefined"
      :aria-selected="item.selected"
      :aria-level="level"
      class="child-node"
      :class="[
        hasChildren(item) ? 'parent-node' : 'end-node',
        hasChildren(item) && item.open ? 'open-node' : 'closed-node'
      ]"
      role="treeitem"
    >
      <slot :item="item" :level="level">
        <TreeItem
          :class="treeListItemClass"
          :disabled="getDisabled(item)"
          :exclude="exclude"
          :item="item"
          as="button"
          @click="onClick($event, item)"
        >
          <slot :item="item" :level="level" name="item" />
        </TreeItem>

        <template v-if="hasChildren(item)">
          <template v-if="isSelectable(item)">
            <Transition :duration="transitionTotalDuration" :name="transitionName">
              <Tree
                v-show="isAlwaysOpen || item.open"
                v-slot="{ item: option }"
                :exclude="exclude"
                :indent="indent"
                :level="level + 1"
                :list="<T[]>item.children"
                :style="indentStyles"
              >
                <TreeItem
                  :class="treeListItemClass"
                  :exclude="exclude"
                  :for="getName(option)"
                  :item="option"
                  as="label"
                >
                  <template #leading>
                    <input
                      :id="getName(option)"
                      :aria-hidden="exclude?.includes('checkbox')"
                      :checked="option.selected"
                      :class="exclude?.includes('checkbox') ? 'sr-only' : ''"
                      :disabled="getDisabled(option)"
                      :name="getName(item)"
                      type="checkbox"
                      @click="onSelect($event, item, option)"
                    />
                  </template>
                  <slot :item="option" :level="level + 1" name="item" />
                </TreeItem>
              </Tree>
            </Transition>
          </template>
          <template v-else>
            <Transition :duration="transitionTotalDuration" :name="transitionName">
              <Tree
                v-show="isAlwaysOpen || item.open"
                v-slot="{ item }"
                :exclude="exclude"
                :indent="indent"
                :level="level + 1"
                :list="<T[]>item.children"
                :style="indentStyles"
              >
                <slot :item="item" :level="level + 1" name="item" />
              </Tree>
            </Transition>
          </template>
        </template>
      </slot>
    </li>
  </ul>
</template>

<style>
ul[role='tree'] {
  width: 100%;

  li {
    transition-property: grid-template-rows;
    transition-duration: var(--transition-duration);
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

    display: grid;
    grid-template-rows: auto 0fr;
    grid-template-columns: 1fr;
    place-content: start;

    &[aria-expanded] {
      min-block-size: 100%;
      min-height: 0;

      > * + ul {
        overflow: hidden;
        min-inline-size: 100%;
      }
    }

    &[aria-expanded='true'] {
      grid-template-rows: auto 1fr;
    }

    &[aria-expanded='false'] {
      transition-timing-function: ease-in-out;
      transition-delay: calc(var(--transition-delay) * 0.4);
    }

    &[aria-selected='true'] {
      background-color: rgb(var(--secondary-container-rgb) / 0.1);
    }
  }

  .tree-enter-active *,
  .tree-leave-active * {
    transition-duration: var(--transition-duration);
    transition-property: transform, opacity;
  }

  .tree-enter-from *,
  .tree-leave-to * {
    opacity: 0;
    transform: translateY(-8px);
    transform-origin: top;
  }

  .tree-enter-active * {
    transition-delay: calc(var(--transition-delay) * 0.2);
  }
}
</style>
