import { getFeedback } from "../../../shared/api"

export const fetchAppeals = async () => {
    try {
        const data = await getFeedback()
        return data
    } catch (error) {
        alert(`Ошибка при получении обратной связи: ${error.response.data}`)
    }
}