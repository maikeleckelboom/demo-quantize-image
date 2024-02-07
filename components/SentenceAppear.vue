<script lang="ts" setup>
withDefaults(
  defineProps<{
    reverseAnimation?: boolean
  }>(),
  {
    reverseAnimation: true
  }
)
</script>

<template>
  <div :class="['v-underline-trigger', { 'reversed-animation': reverseAnimation }]">
    <slot name="trigger" />
    <div class="v-underline">
      <span>
        <slot />
      </span>
    </div>
  </div>
</template>

<style scoped>
.v-underline {
  --_pt: 1lh;
  --_bg-color: rgb(var(--background-rgb));

  span {
    transition: background-size 1s ease;
    padding-bottom: var(--_pt);
    background-image: linear-gradient(transparent calc(100% - var(--_pt)), var(--_bg-color) var(--_pt));
    background-repeat: no-repeat;
    background-size: var(--initial-size); /* Use variable for initial size */
    background-position: 0 100%;
  }

  &:hover {
    span {
      background-size: var(--hover-size); /* Use variable for hover size */
    }
  }
}

/* Parent Trigger */
.v-underline-trigger.reversed-animation .v-underline span {
  --initial-size: 100% 100%; /* Normal initial size */
  --hover-size: 0% 100%; /* Normal hover size */
}

.v-underline-trigger:not(.reversed-animation) .v-underline span {
  --initial-size: 0% 100%; /* Reversed initial size */
  --hover-size: 100% 100%; /* Reversed hover size */
}
</style>
