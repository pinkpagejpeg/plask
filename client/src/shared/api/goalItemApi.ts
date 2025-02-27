import { $authHost } from "./http"

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