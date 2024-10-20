import { $authHost, $host } from "./http"

export const createTask = async (userId, info) => {
    const { data } = await $authHost.post(`api/task/`, { userId, info })
    return data
}

export const updateTask = async (taskId, info) => {
    const { data } = await $authHost.put(`api/task/`, { taskId, info})
    return data
}

export const updateTaskStatus = async (taskId, status) => {
    const { data } = await $authHost.put(`api/task/status`, { taskId, status })
    return data
}

export const deleteTask = async (taskId) => {
    const { data } = await $authHost.delete(`api/task/${taskId}`)
    return data
}

export const getTask = async (userId) => {
    const { data } = await $authHost.get(`api/task/${userId}`)
    return data
}