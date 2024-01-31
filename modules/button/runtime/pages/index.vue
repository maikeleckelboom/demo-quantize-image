<script lang="ts" setup></script>

<template>
  <div class="mx-auto w-full max-w-4xl py-4">
    <h1 class="mb-8 text-headline-lg">Application Buttons</h1>
    <div
      class="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <div class="flex flex-col">
        <p class="mb-4">Text Button</p>
        <Button variant="text">Add to cart</Button>
      </div>
      <div class="flex flex-col">
        <p class="mb-4">Elevated Button</p>
        <Button variant="elevated">Add to cart</Button>
      </div>
      <div class="flex flex-col">
        <p class="mb-4">Filled Button</p>
        <Button variant="filled">Add to cart</Button>
      </div>
      <div class="flex flex-col">
        <p class="mb-4">Filled Tonal Button</p>
        <Button variant="filledTonal"> Add to cart</Button>
      </div>
      <div class="flex flex-col">
        <p class="mb-4">Icon Button</p>
        <Button variant="icon">
          <Icon name="ic:baseline-add" />
        </Button>
      </div>
      <div class="flex flex-col">
        <p class="mb-4">Outlined Button</p>
        <Button variant="outlined"> Add to cart</Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
