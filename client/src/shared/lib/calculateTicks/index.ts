export const calculateYAxisTicks = (values: number[]) => {
    const maxValue = Math.max(...values)

    const countTicks = 5
    const range = maxValue
    const desiredStep = range / countTicks

    const possibleSteps = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100]

    let step = possibleSteps[0]
    for (const s of possibleSteps) {
        if (s >= desiredStep) {
            step = s
            break
        }
    }

    const tickCount = Math.ceil(maxValue / step)
    if (tickCount > countTicks) {
        for (const s of possibleSteps) {
            if (s > step && Math.ceil(maxValue / s) <= countTicks) {
                step = s
                break
            }
        }
    }

    const domainMax = Math.ceil(maxValue / step) * step
    const ticks = []

    for (let i = step; i <= domainMax; i += step) {
        ticks.push(i)
    }

    return { ticks, domainMax, step }
}