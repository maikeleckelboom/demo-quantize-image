<script lang="ts" setup>
import type { Slots } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import { easings, timingFunctions } from '~/modules/theme/motion'
import { getScaleYFromMatrix } from '~/modules/theme/runtime/utils/motion'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { useStack } from '~/modules/dialog/runtime/composables/useStack'
import { and } from '@vueuse/math'
import { Scrim } from '#components'
import { closeDialog } from '~/modules/dialog/runtime/plugin'
import type { DialogProps } from '~/modules/dialog/types'

const props = withDefaults(defineProps<DialogProps>(), {
  intent: 'basic',
  responsive: false,
  closeAffordance: true,
  actions: () => []
})

const slots = defineSlots<{
  default(): any
  icon(): any
  headline(): any
  actions(): any
  'fullscreen-action'(): any
}>()

const variants = tv({
  slots: {
    base: [
      'fixed',
      'm-auto',
      'inset-0',
      'p-0',
      'z-50',
      'bg-transparent',
      'flex',
      'flex-col',
      'justify-start',
      'items-center',
      'text-on-surface',
      'rounded-[28px]',
      'origin-top',
      'before:absolute',
      'before:inset-0',
      'before:z-[-1]',
      'before:shadow-2xl',
      'before:body-[""]',
      'before:origin-top'
    ],
    header: ['w-full bg-surface-container-highest'],
    icon: ['text-secondary icon:h-[24px] icon:w-[24px] mb-[16px]'],
    headline: ['text-headline-sm [text-wrap:balance]'],
    body: [
      'flex',
      'flex-1',
      'justify-start',
      'w-full',
      'px-[24px]',
      'pb-[8px]',
      'pt-[16px]',
      'text-left',
      'text-on-surface-variant',
      'overflow-y-auto',
      'overscroll-contain',
      'scrollbar',
      'scrollbar-thin'
    ],
    actions: ['w-full flex flex-wrap justify-end p-[8px_24px_24px] gap-[8px]'],
    wrapper: ['flex flex-col w-full']
  },
  variants: {
    'has:headline': {
      false: {
        body: 'pt-[24px]'
      }
    },
    'has:icon': {
      false: {
        body: 'pt-[24px]'
      },
      true: {
        headline: 'text-center'
      }
    },
    intent: {
      basic: {
        base: [
          '[max-inline-size:min(calc(100%-48px),560px)]',
          '[max-block-size:80vh]',
          'before:rounded-4xl',
          'before:bg-surface-container-highest'
        ],
        header: 'flex flex-col justify-center items-center pt-[24px] px-[24px] rounded-t-4xl',
        actions: 'rounded-b-4xl',
        wrapper: 'min-w-[280px] max-h-[50ch] max-w-[min(560px,100%)] w-full'
      },
      'full-screen': {
        base: 'h-screen w-screen supports-svh:h-[100svh] supports-svw:w-[100svw] left-0 top-0 m-0 rounded-none bg-surface before:bg-surface',
        icon: 'hidden',
        header:
          'grid grid-cols-[auto,1fr,auto] pl-[16px] pr-[16px] py-[6px] gap-[12px] min-h-[56px] items-center',
        headline: 'text-title-lg md:text-headline-sm leading-tighter line-clamp-2',
        body: 'px-[24px]',
        wrapper: 'max-h-[100dvh] max-w-[100dvw] w-full'
      }
    },
    divider: {
      top: {
        header: 'border-b border-outline-variant'
      },
      bottom: {
        actions: 'border-t border-outline-variant'
      },
      both: {
        header: 'border-b border-outline-variant',
        actions: 'border-t border-outline-variant'
      }
    }
  },
  /** Variants based on a combination of previously defined variants */
  compoundVariants: [
    {
      'has:icon': false,
      'has:headline': false,
      intent: 'basic',
      class: {
        body: 'pt-[24px]',
        actions: 'pb-[16px]'
      }
    },
    {
      'has:icon': true,
      'has:headline': true,
      intent: 'basic',
      class: {
        headline: 'text-center'
      }
    },
    {
      headline: false,
      intent: 'full-screen',
      class: {
        header: '[&_:nth-child(2)]:flex [&_:nth-child(2)]:justify-end'
      }
    },

    // for when headline is false and divider is bottom or both, then actions padding-bottom is 8px, else 16px
    {
      headline: false,
      divider: ['bottom', 'both'],
      class: {
        actions: 'pb-[8px]'
      }
    },
    /** headline is false and divider is either both or bottom */
    {
      headline: false,
      divider: ['both', 'bottom'],
      class: {
        body: 'pb-[16px]'
      }
    },
    /** headline false, icon false, intent basic */
    {
      headline: false,
      icon: false,
      intent: 'basic',
      class: {
        header: 'hidden',
        body: 'pt-[24px]'
      }
    },
    /** headline, icon and closeAffordance are false  */
    {
      intent: 'full-screen',
      headline: false,
      icon: false,
      closeAffordance: false,
      class: {
        header: 'hidden'
      }
    },
    /** Close affordance, full-screen */
    {
      intent: 'full-screen',
      closeAffordance: false,
      class: {
        header: 'grid grid-cols-[1fr,auto] '
      }
    },
    /** Intent - basic | Divider - (top, both) */
    {
      intent: 'basic',
      divider: ['top', 'both'],
      class: {
        body: 'pt-[12px] pb-[12px]',
        header: 'pb-[16px]'
      }
    },
    /** Intent - full-screen | Divider - (bottom, both) */
    {
      intent: 'full-screen',
      divider: ['bottom', 'both'],
      class: {
        actions: 'pb-[8px] ',
        body: 'py-[8px]'
      }
    },
    /** Intent - basic | Icon - false */
    {
      intent: 'basic',
      icon: false,
      class: {
        header: 'items-start px-[24px]',
        icon: 'hidden'
      }
    },
    {
      divider: ['both', 'bottom'],
      class: {
        body: 'grid',
        actions: 'pt-[12px] pb-[12px]'
      }
    }
  ]
})

const hasSlot = (name: keyof Slots): boolean => !!slots[name]?.().length
const hasIcon = () => hasSlot('icon') || !!(props.icon && props.icon.length)
const hasHeadline = () => hasSlot('headline') || (props.headline && props.headline !== '')
const hasActions = () => hasSlot('actions') || props.actions?.length

const viewport = useViewport()

const intent = computed(() => {
  if (props.responsive) {
    return viewport.isGreaterOrEquals('md') ? 'basic' : 'full-screen'
  }
  return props.intent
})

const emit = defineEmits<{ (event: 'close', data?: any) }>()

const actions = computed(() => {
  if (props.closeAffordance && intent.value !== 'full-screen') {
    return [
      {
        label: 'Close',
        onClick: async () => {
          await closeAnimation()
          await closeDialog()
        }
      },
      ...props.actions
    ]
  }
  return props.actions
})

const dialogRef = ref<HTMLDialogElement>()

const scrimRef = ref<InstanceType<typeof Scrim>>()

const bodyRef = ref<HTMLElement>()

type DialogVariants = VariantProps<typeof variants>

const vProps = computed<DialogVariants>(() => ({
  intent: intent.value,
  divider: props.divider,
  'has:icon': hasIcon(),
  'has:headline': hasHeadline(),
  'has:actions': hasActions()
}))

const effects = shallowRef<Animation[]>([])

const topStart = '-56px' as const

async function openAnimation() {
  effects.value.forEach((animation) => animation.pause())

  const scrim = unrefElement(scrimRef)
  const dialog = unrefElement(dialogRef)
  const container = unrefElement(bodyRef)

  const { duration } = easings.emphasizedDecelerate
  const { x0, y0, x1, y1 } = timingFunctions.emphasizedDecelerate

  const easing = `cubic-bezier(${x0},${y0},${x1},${y1})`

  effects.value = [
    scrim.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration,
      fill: 'forwards',
      easing
    }),

    container.animate([{ opacity: 0 }, { opacity: 1 }], {
      fill: 'both',
      delay: duration * 0.15,
      duration: duration * 0.85,
      easing
    }),

    dialog.animate(
      [
        {
          clipPath: 'inset(0 0 100% 0 round 0 0 28px 28px)',
          offset: 0.1,
          opacity: 0.6,
          transform: `translateY(${topStart})`
        },
        {
          clipPath: 'inset(0)',
          offset: 1,
          opacity: 1,
          transform: 'translateY(0)'
        }
      ],
      {
        duration,
        fill: 'forwards',
        easing
      }
    ),

    dialog.animate(
      [
        { transform: 'scaleY(0)', opacity: 0.8 },
        { transform: 'scaleY(1)', opacity: 1 }
      ],
      {
        fill: 'forwards',
        duration,
        easing,
        pseudoElement: '::before'
      }
    )
  ]

  await Promise.all(effects.value.map((animation) => animation.finished))

  effects.value = []
}

async function closeAnimation() {
  effects.value.forEach((animation) => animation.pause())

  const dialog = unrefElement(dialogRef)
  const scrim = unrefElement(scrimRef)
  const container = unrefElement(bodyRef)

  const { opacity: opacityStr } = getComputedStyle(scrim)
  const { top, opacity, clipPath } = getComputedStyle(dialog)
  const { transform } = getComputedStyle(dialog, '::before')
  const transformScaleY = getScaleYFromMatrix(transform)

  const duration = easings.emphasizedAccelerate.duration
  const { x0, y0, x1, y1 } = timingFunctions.emphasizedAccelerate

  const easing = `cubic-bezier(${x0},${y0},${x1},${y1})`

  effects.value = [
    scrim.animate([{ opacity: Number(opacityStr) }, { opacity: 0 }], {
      duration,
      fill: 'forwards',
      easing
    }),
    dialog.animate(
      [
        { clipPath, top, opacity: Number(opacity), offset: 0 },
        {
          clipPath: 'inset(0% 0% 100% 0 round 0 0 28px 28px)',
          top: topStart,
          opacity: 0,
          offset: 1
        }
      ],
      { duration, fill: 'forwards', easing }
    ),
    container.animate(
      [
        { opacity: 1, top, transform: 'translateY(0)' },
        { opacity: 0, top: topStart, transform: `translateY(${topStart})` }
      ],
      { duration, fill: 'both', easing }
    ),
    dialog.animate(
      [
        {
          transform: `scaleY(${transformScaleY})`,
          opacity: 1
        },
        {
          transform: 'scaleY(0)',
          opacity: 0.8
        }
      ],
      {
        duration,
        easing,
        fill: 'forwards',
        pseudoElement: '::before'
      }
    )
  ]
  await Promise.all(effects.value.map((animation) => animation.finished))
  effects.value = []
}

function initialFocus() {
  const focusable = Array.from(
    dialogRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  )
  return <HTMLElement>(
    (focusable.find((el) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) ??
      focusable.at(0))
  )
}

const { deactivate } = useFocusTrap(dialogRef, {
  immediate: true,
  returnFocusOnDeactivate: true,
  allowOutsideClick: true,
  initialFocus
})

const { isTop } = useStack()

onUnmounted(() => {
  deactivate()
})

onMounted(() => {
  openAnimation()
})

onClickOutside(dialogRef, async () => {
  if (!isTop.value) return
  await closeAnimation()
  await closeDialog()
})

const { escape } = useMagicKeys()

const close = async () => {
  await closeAnimation()
  await closeDialog()
}

whenever(and(escape, isTop), close)

async function onClickEvent(clickHandler: Function) {
  clickHandler({ close })
}

const {
  header: headerV,
  base: baseV,
  icon: iconV,
  headline: headlineV,
  body: bodyV,
  actions: actionsV,
  wrapper: wrapperV
} = variants(vProps.value)

const isAlertDialog = computed(() => intent.value === 'basic')

const id = nanoid()
const headlineId = `dialog-headline-${id}` as const
const textId = `dialog-description-${id}` as const

const accessibilityAttrs = shallowReactive({
  'aria-labelledby': `dialog-headline-${id}`,
  'aria-describedby': `dialog-desc-${id}`,
  role: isAlertDialog.value ? 'alertdialog' : 'dialog'
})
</script>

<template>
  <Scrim ref="scrimRef">
    <dialog ref="dialogRef" open :class="baseV(vProps)" v-bind="accessibilityAttrs">
      <div ref="bodyRef" :class="wrapperV(vProps)">
        <header :class="headerV(vProps)" ref="header" v-if="hasHeadline() || hasIcon()">
          <div :class="iconV(vProps)" v-if="hasIcon">
            <slot name="icon">
              <Icon v-if="icon" :name="icon" />
            </slot>
          </div>
          <div v-if="closeAffordance && intent === 'full-screen'">
            <Button intent="icon" size="sm" @click="close">
              <Icon name="ic:round-close" />
            </Button>
          </div>
          <h1 v-if="hasHeadline" :id="headlineId" :class="headlineV(vProps)">
            <slot name="headline">{{ props.headline }}</slot>
          </h1>
          <div v-if="intent === 'full-screen'">
            <slot name="fullscreen-action">
              <Button intent="text"> Update</Button>
            </slot>
          </div>
        </header>
        <article :class="bodyV(vProps)" ref="body">
          <slot>
            <p :id="textId">{{ props.text }}</p>
          </slot>
        </article>
        <footer :class="actionsV(vProps)" ref="footer">
          <slot :actions="actions" name="actions">
            <slot
              v-for="action in actions"
              :key="action.label"
              :action="action"
              :name="`action-${action.label}`"
            >
              <Button intent="text" @click="onClickEvent(action.onClick)">
                {{ action.label }}
              </Button>
            </slot>
          </slot>
        </footer>
      </div>
    </dialog>
  </Scrim>
</template>

<style scoped></style>
