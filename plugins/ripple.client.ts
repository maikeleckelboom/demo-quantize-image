import type { DirectiveBinding } from 'vue'
import { easings, timingFunctions } from '~/modules/theme/motion-presets'

export default defineNuxtPlugin((nuxtApp) => {
  const { x0, y0, x1, y1 } = timingFunctions.standardAccelerate
  const { duration } = easings.standardAccelerate
  const backgroundColor: string = 'var(--ripple-color, rgb(var(--primary-rgb) / 0.4))' as const

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
        }
        @keyframes ripple {
            to {
                opacity: 0;
                transform: scale(2);
            }
        }
    `
  useHead({ style: [{ id: 'directives.ripple', textContent }] })

  const createRipple = (
    diameter: number,
    x: number,
    y: number,
    options?: { color?: string; duration?: number }
  ) => {
    const ripple = document.createElement('div')
    ripple.style.left = `${x - diameter / 2}px`
    ripple.style.top = `${y - diameter / 2}px`
    ripple.style.setProperty('--ripple-diameter', `${diameter}px`)
    options?.color && ripple.style.setProperty('--ripple-color', options.color)
    options?.duration && ripple.style.setProperty('--ripple-duration', `${options.duration}ms`)
    ripple.classList.add('ripple')
    return ripple
  }

  const getBindingColorValue = (binding?: DirectiveBinding) => {
    if (!binding?.value) return
    if (typeof binding.value === 'string') {
      return binding.value
    }
    if (typeof binding.value === 'object') {
      return binding.value.color
    }
  }

  const getBindingDurationValue = (binding?: DirectiveBinding, clientWidth: number = 0) => {
    return binding?.value && typeof binding.value === 'object'
      ? binding.value.duration
      : duration + clientWidth * 0.5
  }

  const getDiameter = (width: number, height: number) => {
    return Math.max(width, height)
  }

  let raf: number | null = null

  const createAndRemoveRipple = (
    { currentTarget, offsetX, offsetY }: PointerEvent,
    binding?: DirectiveBinding
  ) => {
    const el = currentTarget as HTMLElement | undefined
    if (!el) return
    const { clientWidth, clientHeight } = el
    const diameter = getDiameter(clientWidth, clientHeight)
    const color = getBindingColorValue(binding)
    const duration = getBindingDurationValue(binding, clientWidth)
    const ripple = createRipple(diameter, offsetX, offsetY, { color, duration })
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      el.appendChild(ripple)
      setTimeout(() => ripple.remove(), duration)
    })
  }
  nuxtApp.vueApp.directive('ripple', {
    mounted(el, binding) {
      if (!el || binding.value === false) {
        return
      }
      /*      if (isObject(binding.value) && 'target' in binding.value) {
              const target = el.querySelector(binding.value.target)
              if (target) {
                console.log('target', target)
                target.addEventListener('pointerdown', (ev: PointerEvent) => createAndRemoveRipple(ev, binding))
                return
              }
            }*/
      el.addEventListener('pointerdown', (ev: PointerEvent) => createAndRemoveRipple(ev, binding))
    },
    unmounted(el, binding) {
      el.removeEventListener('pointerdown', (ev: PointerEvent) => createAndRemoveRipple(ev, binding))
    }
  })
})
