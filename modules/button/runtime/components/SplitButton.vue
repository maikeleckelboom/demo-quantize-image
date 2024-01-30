<script lang="ts" setup>
type Action = {
  label: string
  icon?: string
  action?: () => void
  priority?: number
}

interface Props {
  actions?: Action[]
}

const props = defineProps<Props>()

function withPriority(actions: Action[] | undefined) {
  if (!actions) return []
  return actions.map((action, index) => {
    return {
      ...action,
      priority: index
    }
  })
}

const actions = ref(withPriority(props.actions))

const primaryAction = computed(() => {
  return actions.value.find((action) => action.priority === 0)
})

const secondaryActions = computed(() => {
  return actions.value.filter((action) => action.priority !== 0)
})
</script>

<template>
  <div class="split-button">
    <button>
      <template v-if="primaryAction">
        <span>{{ primaryAction.label }}</span>
      </template>
    </button>
    <button>
      <slot name="icon">
        <Icon class="size-8" name="ic:right" />
      </slot>
    </button>
  </div>
</template>

<style scoped>
.split-button {
}
</style>
