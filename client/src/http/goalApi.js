import { $authHost, $host } from "./index"

export const createGoal = async (userId, info) => {
    const { data } = await $authHost.post(`api/goal/`, { userId, info })
    return data
}

export const updateGoal = async (goalId, info) => {
    const { data } = await $authHost.put(`api/goal/`, { goalId, info})
    return data
}

// export const updateGoalStatus = async (taskId, status) => {
//     const { data } = await $authHost.put(`api/goal/status`, { taskId, status })
//     return data
// }

export const deleteGoal = async (goalId) => {
    const { data } = await $authHost.delete(`api/goal/${goalId}`)
    return data
}

export const getGoal = async (userId) => {
    const { data } = await $authHost.get(`api/goal/${userId}`)
    return data
}