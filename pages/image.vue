<script lang="ts" setup>
const files = ref<File[]>([])
const { selectedFile } = useFileSelection(files)

function onDrop(droppedFiles: File[]) {
  files.value = droppedFiles
}

function resetFiles() {
  files.value = []
}

const maxColors = ref<number>(128)

function loadExampleImage() {
  if (import.meta.server) return
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-xl flex-col gap-8 p-4">
    <div class="mb-2">
      <h1 class="mb-2 text-headline-sm leading-snug">Upload an image to generate color palettes</h1>
      <p class="text-body-sm text-on-surface-variant">
        The image is digitally analyzed, a single color is selected as the source color, and tones are chosen
        and assigned to each color role.
      </p>
    </div>
    <div class="h-64 overflow-hidden">
      <FilePreview v-if="selectedFile" :file="selectedFile" />
      <FileDropZone v-else @drop="onDrop" />
    </div>
    <!--    <div class="mb-12">
          &lt;!&ndash; Space &ndash;&gt;
        </div>-->
    <div>
      <fieldset>
        <div class="flex flex-col justify-between">
          <label class="mb-2 flex flex-nowrap gap-x-2 text-label-md" for="maxColors">
            Max Colors
            <Tooltip class="justify-self-end">
              <button>
                <Icon class="h-4 w-4 text-on-surface-variant" name="ic:baseline-info" />
              </button>
              <template #content> The maximum number of colors to generate from the image.</template>
            </Tooltip>
          </label>
          <LabeledInputSlider v-model="maxColors" max="128" min="1" step="1" />
        </div>
      </fieldset>
    </div>
    <div class="flex flex-col">
      <Buttons class="justify-end">
        <Button v-if="selectedFile" intent="text" @click="resetFiles">Reset</Button>
        <Button v-else intent="outlined" @click="loadExampleImage"> Load Example Image</Button>
        <Button :disabled="!selectedFile"> Extract Colors</Button>
      </Buttons>
    </div>
  </div>
</template>

<style scoped></style>
