<script lang="ts" setup>
import Button from '~/modules/button/runtime/Button.vue'
import FileInputPreview from '~/modules/theme/runtime/components/Controls/FileInputPreview.vue'

interface Props {
  file?: File | null
  multiple?: boolean;
  accept?: string;
  capture?: string;
  reset?: boolean;
  directory?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  file: null,
  multiple: true,
  accept: 'image/*',
  capture: undefined,
  reset: false,
  directory: false
})

const emit = defineEmits<{
  change: [file: File | null]
  commit: [file: File]
}>()

const { files, open, reset, onChange } = useFileDialog({
  accept: props.accept,
  capture: props.capture,
  reset: props.reset,
  directory: props.directory,
  multiple: props.multiple
})

watch(files, (v) => {
  file.value = v?.[0] ?? null
})

const file = shallowRef<File | null>(props.file)

onChange((selectedFiles) => {
  if (!selectedFiles) {
    return
  }
  const [selectedFile] = selectedFiles
  file.value = selectedFile
  emit('change', file.value)
})

function commit() {
  if (!file.value) {
    return
  }
  emit('commit', file.value)
}

defineExpose({
  open,
  reset,
  commit,
  file,
  files
})
</script>

<template>
  <div class="flex flex-col gap-7">
    <template v-if="!file">
      <button class="outlined-button" type="button" @click="open()">
        Choose an image
      </button>
    </template>
    <template v-else>
      <FileInputPreview :file="file" />
      <div class="flex gap-3">
        <button class="outlined-button" type="button" @click="reset()">
          Reset
        </button>
        <slot name="actions">
          <button class="filled-button" type="button" @click="commit">
            Extract color palette
          </button>
        </slot>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
