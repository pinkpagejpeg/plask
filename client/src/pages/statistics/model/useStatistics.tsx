import { useEffect, useState, useCallback } from "react"
import { getWeekStatistics } from "@/shared/api"
import { getWeekRange } from "@/shared/lib"
import type { IDayData, IWeekParams } from "./types"

export const useWeekStatistics = (initialDate: Date = new Date()) => {
    const [weeklyData, setWeeklyData] = useState<IDayData[]>([])
    const [weekParams, setWeekParams] = useState<IWeekParams>(() => getWeekRange(initialDate))
    const [tasksDone, setTasksDone] = useState(0)
    const [daysBest, setDaysBest] = useState(0)
    const [daysActive, setDaysActive] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchWeekStatistics = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await getWeekStatistics(weekParams.from, weekParams.to)
            setWeeklyData(data.weeklyData)
            setTasksDone(data.tasksDone)
            setDaysBest(data.daysBest)
            setDaysActive(data.daysActive)
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Неизвестная ошибка"
            setError(`При получении недельной статистики возникла ошибка: ${message}`)
        } finally {
            setLoading(false)
        }
    }, [weekParams.from, weekParams.to])

    useEffect(() => {
        fetchWeekStatistics()
    }, [fetchWeekStatistics])

    return {
        weeklyData,
        weekParams,
        setWeekParams,
        tasksDone,
        daysBest,
        daysActive,
        loading,
        error
    }
}