<script generic="TItem extends NavListItem" lang="ts" setup>
import type { NavigationListItem as NavListItem } from '~/modules/list/types'

interface Props {
  list: TItem[]
  type?: 'single' | 'multiple'
  transitionName?: string
  transitionDuration?: number
}

const {
  list,
  transitionName = 'list-item',
  transitionDuration = 400,
  type = 'multiple'
} = defineProps<Props>()

const transitionDelay = computed<number>(() => interpolate(transitionDuration))
const transitionTotalDuration = computed<number>(() => transitionDuration + transitionDelay.value)

function openItemCloseOthers(item: TItem) {
  list.forEach((i) => {
    i.open = i !== item ? false : !i.open
  })
}

const onClicked = (evt: MouseEvent, item: TItem) => {
  if (type === 'single') {
    openItemCloseOthers(item)
    return
  }

  item.open = !item.open
}

defineSlots<{
  default({ item, level }: { item: TItem; level: number }): any
}>()
</script>

<template>
  <RecursiveList
    v-slot="{ item, level, isRecursive }"
    :list="list"
    :style="{
      '--transition-delay': `${transitionDelay}ms`,
      '--transition-duration': `${transitionDuration}ms`
    }"
    class="collapsable-list"
  >
    <slot v-bind="{ item, level, isRecursive }">
      <NavigationListItem
        :item="item"
        :level="level"
        :on-clicked="onClicked"
        active-class="text-primary bg-surface-level-1 font-semibold border-r border-2 border-error"
        exact-active-class="bg-surface-level-2 text-on-primary font-bold"
      >
        <span
          class="flex w-full items-center justify-between gap-4 rounded-sm p-2.5 hover:bg-primary-container/10 active:bg-primary-container/20"
        >
          {{ item.label }}
          <template v-if="isRecursive">
            <Icon v-if="item.open" class="size-4" name="ic:baseline-unfold-more" />
            <Icon v-else class="size-4" name="ic:baseline-unfold-less" />
          </template>
        </span>
        <template #children="{ item, level, labelledBy }">
          <Transition :duration="transitionTotalDuration" :name="transitionName">
            <div
              v-show="item.open"
              :id="`${labelledBy}-panel`"
              :aria-labelledby="labelledBy"
              :class="{ 'pl-4': level >= 0 }"
              role="region"
            >
              <NavigationList :level="level + 1" :list="<TItem[]>item.children" />
            </div>
          </Transition>
        </template>
      </NavigationListItem>
    </slot>
  </RecursiveList>
</template>

<style scoped>
.collapsable-list {
  --transition-delay: var(--transition-delay, 100ms);
  --transition-duration: var(--transition-duration, 400ms);

  li {
    display: grid;
    grid-template-rows: auto 0fr;

    transform: translateX(0px);
    transition-duration: var(--transition-duration);
    transition-property: grid-template-rows;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

    &[aria-expanded] {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto 0fr;
      place-content: start;

      min-block-size: 100%;
      min-height: 0;

      > button + div {
        overflow: hidden;
        min-inline-size: 100%;
      }
    }

    &[aria-expanded='true'] {
      grid-template-rows: auto 1fr;
    }

    &[aria-expanded='false'] {
      transition-timing-function: ease-in-out;
      transition-delay: var(--transition-delay);
    }
  }

  .list-item-enter-active ul,
  .list-item-leave-active ul {
    transition-duration: var(--transition-duration);
    transition-property: transform, opacity;
  }

  .list-item-enter-from ul,
  .list-item-leave-to ul {
    opacity: 0;
    transform: translateX(1em);
  }

  .list-item-enter-active ul {
    transition-delay: calc(var(--transition-delay) * 2);
  }
}
</style>
