import { $authHost } from "./http"

export const createFeedback = async (userId: number, info: string) => {
    const { data } = await $authHost.post(`api/feedback/`, { userId, info })
    return data
}

export const updateFeedbackStatus = async (feedbackId: number, status: boolean) => {
    const { data } = await $authHost.patch(`api/feedback/${feedbackId}`, { status })
    return data
}

export const getFeedback = async () => {
    const { data } = await $authHost.get(`api/feedback/`)
    return data
}