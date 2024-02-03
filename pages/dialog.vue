<script lang="ts" setup>
const isVisible = ref<boolean>(true)

const { sourceColor } = useThemeConfig()

const {
  steps,
  stepNames,
  index,
  current,
  next,
  previous,
  isFirst,
  isLast,
  goTo,
  goToNext,
  goToPrevious,
  goBackTo,
  isNext,
  isPrevious,
  isCurrent,
  isBefore,
  isAfter
} = useStepper(['choosing-source-color', 'terms', 'payment'])
</script>

<template>
  <div>
    <Button @click="isVisible = true">Open dialog</Button>
    <DialogComponent :open="isVisible" @close="isVisible = false">
      <div class="grid gap-4">
        <KeyColorModel />
      </div>
      <template #footer>
        <Buttons>
          <Button intent="outlined">
            <icon name="ic:round-arrow-right-alt" />
            Apply
          </Button>
        </Buttons>
      </template>
    </DialogComponent>
  </div>
</template>

<style scoped></style>
