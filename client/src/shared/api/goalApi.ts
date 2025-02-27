import { $authHost } from "./http"

// Goal
export const createGoal = async (info: string) => {
    const { data } = await $authHost.post(`api/goal/`, { info })
    return data
}

export const updateGoal = async (goalId: number, info: string) => {
    const { data } = await $authHost.patch(`api/goal/${goalId}`, { info })
    return data
}

export const deleteGoal = async (goalId: number) => {
    const { data } = await $authHost.delete(`api/goal/${goalId}`)
    return data
}

export const getGoals = async () => {
    const { data } = await $authHost.get(`api/goal/user`)
    return data
}

export const getGoal = async (goalId: number) => {
    const { data } = await $authHost.get(`api/goal/${goalId}`)
    return data
}

export const getGoalProgress = async (goalId: number) => {
    const { data } = await $authHost.get(`api/goal/${goalId}/progress`)
    return data
}