import type { SliderProps } from '~/modules/slider/types'

export function useSteps(props: SliderProps) {
    const min = computed(() => Number(props?.min ?? 0))
    const max = computed(() => Number(props?.max ?? 100))
    const step = computed(() => {
        const step = Number(props?.step ?? 1)
        return step < 1 ? 1 : step
    })
    const stepCount = computed(() => Math.round((unref(max) - unref(min)) / unref(step)))
    const steps = computed(() => {
        const steps = []
        for (let i = 0; i <= stepCount.value; i++) {
            const v = unref(min) + (i * unref(step))
            steps.push(v)
        }
        return steps
    })
    function getClosestStep(value: number) {
        return steps.value.reduce((prev, curr) => {
            return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev)
        })
    }
    return {
        steps,
        min,
        max,
        step,
        stepCount,
        getClosestStep,
    }
}
