import { $authHost } from "./http"

// Goal
export const createGoal = async (userId: number, info: string) => {
    const { data } = await $authHost.post(`api/goal/`, { userId, info })
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

export const getGoals = async (userId: number) => {
    const { data } = await $authHost.get(`api/goal/user/${userId}`)
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

// Subgoal
export const createGoalItem = async (goalId: number, info: string) => {
    const { data } = await $authHost.post(`api/goal/${goalId}/items`, { info })
    return data
}

export const updateGoalItem = async (goalId: number, goalItemId: number, info: string) => {
    const { data } = await $authHost.patch(`api/goal/${goalId}/items/${goalItemId}`, { info })
    return data
}

export const updateGoalItemStatus = async (goalId: number, goalItemId: number, status: boolean) => {
    const { data } = await $authHost.patch(`api/goal/${goalId}/items/${goalItemId}/status`, { status })
    return data
}

export const deleteGoalItem = async (goalId: number, goalItemId: number) => {
    const { data } = await $authHost.delete(`api/goal/${goalId}/items/${goalItemId}`)
    return data
}

export const getGoalItems = async (goalId: number) => {
    const { data } = await $authHost.get(`api/goal/${goalId}/items`)
    return data
}