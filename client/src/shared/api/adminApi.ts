import { $authHost } from "./http"

// Users
export const createUser = async (email: string, password: string, role: string) => {
    const { data } = await $authHost.post('api/admin/users', { email, password, role })
    return data
}

export const updateUser = async (userId: number, email: string, password: string, role: string) => {
    const { data } = await $authHost.patch(`api/admin/users/${userId}`, { email, password, role })
    return data
}

export const getUsers = async () => {
    const { data } = await $authHost.get('api/admin/users')
    return data
}

export const deleteUser = async (userId: number) => {
    const { data } = await $authHost.delete(`api/admin/users/${userId}`)
    return data
}

// Feedbacks
export const getFeedbacks = async () => {
    const { data } = await $authHost.get(`api/admin/feedbacks`)
    return data
}

export const updateFeedbackStatus = async (feedbackId: number, status: boolean) => {
    const { data } = await $authHost.patch(`api/admin/feedbacks/${feedbackId}`, { status })
    return data
}