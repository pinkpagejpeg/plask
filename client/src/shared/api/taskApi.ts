import { $authHost } from "./http"

export const createTask = async (userId: number, info: string) => {
    const { data } = await $authHost.post(`api/task/`, { userId, info })
    return data
}

export const updateTask = async (taskId: number, info: string) => {
    const { data } = await $authHost.patch(`api/task/${taskId}`, { info })
    return data
}

export const updateTaskStatus = async (taskId: number, status: boolean) => {
    const { data } = await $authHost.patch(`api/task/${taskId}/status`, { status })
    return data
}

export const deleteTask = async (taskId: number) => {
    const { data } = await $authHost.delete(`api/task/${taskId}`)
    return data
}

export const getTask = async (userId: number) => {
    const { data } = await $authHost.get(`api/task/user/${userId}`)
    return data
}