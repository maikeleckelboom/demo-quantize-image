<script lang="ts" setup>
import {useSchemeColors} from "#imports";

const scheme = useSchemeColors({brightnessSuffix:true})

</script>

<template>
  <div>
    <!-- The brand new color picker -->
    <pre>{{scheme}}</pre>
  </div>
</template>

<style scoped>

</style>
