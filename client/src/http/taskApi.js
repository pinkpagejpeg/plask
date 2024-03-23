import { $authHost, $host } from "./index"

export const createTask = async (userId, info) => {
    const { data } = await $authHost.post(`api/task/`, { userId, info })
    return data
}

export const updateTask = async (id, body) => {
    const { data } = await $authHost.put(`api/task/${id}`, body )
    return data
}

export const deleteTask = async (id) => {
    const { data } = await $authHost.delete(`api/task/${id}`)
    return data
}

export const getTask = async (userId) => {
    const { data } = await $authHost.get(`api/task/${userId}`)
    return data
}