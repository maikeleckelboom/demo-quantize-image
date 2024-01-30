<script lang="ts" setup>
import Button from '~/modules/button/runtime/components/Button.vue'

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
  multiple: false,
  accept: '*',
  reset: true,
  directory: false
})

const emit = defineEmits<{
  change: [file: File | null]
  reset: []
  commit: [file: File]
}>()

const { files, open, reset, onChange } = useFileDialog({
  accept: props.accept,
  reset: props.reset,
  directory: props.directory,
  capture: props.capture,
  multiple: props.multiple
})

const count = ref<number>(0)

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

function onReset() {
  emit('reset')
  file.value = null
  count.value += 1
  reset()
}
</script>

<template>
  <div class="flex flex-col gap-7">
    <div class="flex gap-4">
      <button class="outlined-button" type="button" @click="open()">
        {{ file ? 'Change image' : 'Choose an image' }}
      </button>
      <button v-if="file" class="outlined-button" type="button" @click="onReset()">
        Reset
      </button>
    </div>
    <template v-if="file">
      <FileInputPreview :file="file" />
      <slot name="chosen" v-bind="{open,reset, commit, count}">
        <div class="flex gap-3">
          <button class="outlined-button" type="button" @click="reset()">
            Reset
          </button>
          <button class="filled-button" type="button" @click="commit">
            Commit
          </button>
        </div>
      </slot>
    </template>
  </div>
</template>

<style scoped></style>
