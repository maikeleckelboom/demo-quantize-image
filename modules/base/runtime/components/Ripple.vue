<script lang="ts" setup>
import { easings, timingFunctions } from '~/modules/theme/runtime/utils/motion'

const { x0, y0, x1, y1 } = timingFunctions.standardAccelerate
const { duration } = easings.standard
const backgroundColor: string = 'var(--ripple-color, rgb(var(--surface-tint-rgb) / 0.4))' as const

const textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: var(--ripple-color, ${backgroundColor});
            animation: ripple var(--ripple-duration, ${duration}ms) cubic-bezier(${x0}, ${y0}, ${x1}, ${y1});
            height: var(--ripple-diameter);
            width: var(--ripple-diameter);
            transform: scale(0);
            pointer-events: none;
            z-index: 0;
            inset: 0;
            grid-row: 1 / -1;
            grid-column: 1 / -1;
        }
        @keyframes ripple {
            to {
                opacity: 0;
                transform: scale(10);
            }
        }
    `
useHead({ style: [{ id: 'directives.ripple', textContent }] })

const el = ref<HTMLElement>()
const parentElement = useParentElement(el)

function createRipple(diameter: number, x: number, y: number) {
  const ripple = document.createElement('div')
  ripple.style.left = `${x - diameter / 2}px`
  ripple.style.top = `${y - diameter / 2}px`
  const duration = Math.sqrt(diameter) * 100
  const durationBasedOnDiameter = Math.min(duration, 1000)
  ripple.style.setProperty('--ripple-duration', `${durationBasedOnDiameter}ms`)
  ripple.style.setProperty('--ripple-diameter', `${diameter}px`)
  ripple.classList.add('ripple')
  return ripple
}

let raf: number | null = null

function getDiameter(width: number, height: number) {
  return Math.max(width, height)
}

function createAndRemoveRipple({ currentTarget, offsetX, offsetY }: PointerEvent) {
  const el = currentTarget as HTMLElement | undefined
  if (!el || !parentElement.value) return
  const { clientWidth, clientHeight } = parentElement.value
  const diameter = getDiameter(clientWidth, clientHeight)
  const ripple = createRipple(diameter, offsetX, offsetY)
  if (raf) cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    el.appendChild(ripple)
    setTimeout(() => ripple.remove(), duration)
  })
}

useEventListener(parentElement, 'pointerdown', createAndRemoveRipple)
</script>

<template>
  <span ref="el" class="ripple-target">
    <slot></slot>
  </span>
</template>

<style scoped>
.ripple-target {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}
</style>
