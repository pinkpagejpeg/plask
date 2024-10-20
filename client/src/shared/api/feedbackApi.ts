import { $authHost, $host } from "./http"

export const createFeedback = async (userId, info) => {
    const { data } = await $authHost.post(`api/feedback/`, { userId, info })
    return data
}

export const updateFeedbackStatus = async (feedbackId) => {
    const { data } = await $authHost.put(`api/feedback/`, { feedbackId })
    return data
}

export const getFeedback = async () => {
    const { data } = await $authHost.get(`api/feedback/`)
    return data
}