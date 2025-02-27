import { $authHost } from "./http"

export const createFeedback = async (info: string) => {
    const { data } = await $authHost.post(`api/feedback/`, { info })
    return data
}