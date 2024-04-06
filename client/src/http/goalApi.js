import { $authHost, $host } from "./index"

export const createGoal = async (userId, info) => {
    const { data } = await $authHost.post(`api/goal/`, { userId, info })
    return data
}

export const updateGoal = async (goalId, info) => {
    const { data } = await $authHost.put(`api/goal/`, { goalId, info})
    return data
}

export const deleteGoal = async (goalId) => {
    const { data } = await $authHost.delete(`api/goal/${goalId}`)
    return data
}

export const getGoals = async (userId) => {
    const { data } = await $authHost.get(`api/goal/user/${userId}`)
    return data
}

export const getGoal = async (goalId) => {
    const { data } = await $authHost.get(`api/goal/${goalId}`)
    return data
}

export const getGoalProgress = async (goalId) => {
    const { data } = await $authHost.get(`api/goal/progress/${goalId}`)
    return data
}

// Goal Item

export const createGoalItem = async (goalId, info) => {
    const { data } = await $authHost.post(`api/goal/item`, { goalId, info })
    return data
}

export const updateGoalItem = async (goalItemId, info) => {
    const { data } = await $authHost.put(`api/goal/item`, { goalItemId, info})
    return data
}

export const updateGoalItemStatus = async (goalItemId, status) => {
    const { data } = await $authHost.put(`api/goal/item/status`, { goalItemId, status })
    return data
}

export const deleteGoalItem = async (goalItemId) => {
    const { data } = await $authHost.delete(`api/goal/item/${goalItemId}`)
    return data
}

export const getGoalItems = async (goalId) => {
    const { data } = await $authHost.get(`api/goal/item/${goalId}`)
    return data
}