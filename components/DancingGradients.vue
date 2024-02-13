<script lang="ts" setup></script>

<template>
  <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
    <defs>
      <radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5">
        <animate attributeName="fx" dur="34s" repeatCount="indefinite" values="0%;3%;0%"></animate>
        <stop offset="0%" stop-color="rgb(var(--primary-rgb) / 1)" />
        <stop offset="100%" stop-color="rgb(var(--primary-rgb) / 0)" />
      </radialGradient>
      <radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5">
        <animate attributeName="fx" dur="23.5s" repeatCount="indefinite" values="0%;3%;0%"></animate>
        <stop offset="0%" stop-color="rgb(var(--secondary-rgb) / 1)" />
        <stop offset="100%" stop-color="rgb(var(--secondary-rgb) / 0)" />
      </radialGradient>
      <radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5">
        <animate attributeName="fx" dur="21.5s" repeatCount="indefinite" values="0%;3%;0%"></animate>

        <stop offset="0%" stop-color="rgb(var(--tertiary-rgb) / 1)" />
        <stop offset="100%" stop-color="rgb(var(--tertiary-rgb) / 0)" />
      </radialGradient>
      <radialGradient id="Gradient4" cx="50%" cy="50%" fx="4.56417%" fy="50%" r=".5">
        <animate attributeName="fx" dur="23s" repeatCount="indefinite" values="0%;5%;0%"></animate>
        <stop offset="0%" stop-color="rgb(var(--primary-container-rgb) / 1)" />
        <stop offset="100%" stop-color="rgb(var(--primary-container-rgb) / 0)" />
      </radialGradient>
      <radialGradient id="Gradient5" cx="50%" cy="50%" fx="2.65405%" fy="50%" r=".5">
        <animate attributeName="fx" dur="24.5s" repeatCount="indefinite" values="0%;5%;0%"></animate>
        <stop offset="0%" stop-color="rgb(var(--secondary-container-rgb) / 1)" />
        <stop offset="100%" stop-color="rgb(var(--secondary-container-rgb) / 0)" />
      </radialGradient>
      <radialGradient id="Gradient6" cx="50%" cy="50%" fx="0.981338%" fy="50%" r=".5">
        <animate attributeName="fx" dur="25.5s" repeatCount="indefinite" values="0%;5%;0%"></animate>
        <stop offset="0%" stop-color="rgb(var(--tertiary-container-rgb) / 1)" />
        <stop offset="100%" stop-color="rgb(var(--tertiary-rgb) / 0)" />
      </radialGradient>
    </defs>

    <rect
      fill="url(#Gradient1)"
      height="100%"
      transform="rotate(334.41 50 50)"
      width="100%"
      x="13.744%"
      y="1.18473%"
    >
      <animate attributeName="x" dur="20s" repeatCount="indefinite" values="25%;0%;25%"></animate>
      <animate attributeName="y" dur="21s" repeatCount="indefinite" values="0%;25%;0%"></animate>
      <animateTransform
        attributeName="transform"
        dur="7s"
        from="0 50 50"
        repeatCount="indefinite"
        to="360 50 50"
        type="rotate"
      ></animateTransform>
    </rect>
    <rect
      fill="url(#Gradient2)"
      height="100%"
      transform="rotate(255.072 50 50)"
      width="100%"
      x="-2.17916%"
      y="35.4267%"
    >
      <animate attributeName="x" dur="23s" repeatCount="indefinite" values="-25%;0%;-25%"></animate>
      <animate attributeName="y" dur="24s" repeatCount="indefinite" values="0%;50%;0%"></animate>
      <animateTransform
        attributeName="transform"
        dur="12s"
        from="0 50 50"
        repeatCount="indefinite"
        to="360 50 50"
        type="rotate"
      ></animateTransform>
    </rect>
    <rect
      fill="url(#Gradient3)"
      height="100%"
      transform="rotate(139.903 50 50)"
      width="100%"
      x="9.00483%"
      y="14.5733%"
    >
      <animate attributeName="x" dur="25s" repeatCount="indefinite" values="0%;25%;0%"></animate>
      <animate attributeName="y" dur="12s" repeatCount="indefinite" values="0%;25%;0%"></animate>
      <animateTransform
        attributeName="transform"
        dur="9s"
        from="360 50 50"
        repeatCount="indefinite"
        to="0 50 50"
        type="rotate"
      ></animateTransform>
    </rect>
  </svg>
</template>

<style scoped></style>
