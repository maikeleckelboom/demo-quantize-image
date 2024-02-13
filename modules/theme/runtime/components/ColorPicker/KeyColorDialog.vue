<script lang="ts" setup>
import type { ColorPickerOptions } from '~/modules/dialog/runtime/factory'
import type { DialogComponent } from '#components'
import KeyColorSettings from '~/modules/theme/runtime/components/ColorPicker/KeyColorSettings.vue'

const props = withDefaults(defineProps<ColorPickerOptions>(), {
  keyColor: 'Key Color',
  initialColor: 0
})

const root = ref<InstanceType<typeof DialogComponent>>()

const { close } = useDialogs()

function exit() {
  close(null)
}

const { Escape } = useMagicKeys()
whenever(Escape, () => exit())

const localColor = ref<number>(props.initialColor)

const colorValue = computed({
  get: () => localColor.value,
  set: (v) => {
    props.onColorChange(v)
    localColor.value = v
  }
})

function save() {
  close(localColor.value)
}

function getKeyColorName(keyColor: string) {
  return sentenceCase(`sourceColor` === keyColor ? keyColor : `${keyColor} key color`)
}

const bookmarked = ref<boolean>(false)
</script>

<template>
  <DialogComponent ref="root" @close="exit">
    <template #header>
      <h1 class="px-2 text-title-lg font-medium capitalize md:px-4 md:text-headline-sm">
        {{ getKeyColorName(keyColor) }}
      </h1>
    </template>
    <template #header-actions>
      <!--      <IconButton
              :aria-label="bookmarked ? 'Remove bookmark' : 'Bookmark'"
              :selected="bookmarked"
              :title="bookmarked ? 'Remove bookmark' : 'Bookmark'"
              size="sm"
              @click="bookmarked = !bookmarked"
            >
              <Icon v-if="bookmarked" class="text-secondary" name="ic:round-bookmark" />
              <Icon v-else name="ic:round-bookmark-border" />
            </IconButton>-->
    </template>
    <div class="relative mx-auto max-w-xl p-4">
      <KeyColorSettings v-model="colorValue" />
    </div>
    <template #footer>
      <Buttons class="mb-4 ml-auto w-fit">
        <Button intent="text" @click="exit">Cancel</Button>
        <Button intent="outlined" @click="save">Save</Button>
      </Buttons>
    </template>
  </DialogComponent>
</template>

<style scoped></style>
