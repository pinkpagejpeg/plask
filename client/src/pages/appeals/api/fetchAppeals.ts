import { getFeedbacks } from "../../../shared/api"

export const fetchAppeals = async () => {
    try {
        const data = await getFeedbacks()
        return data
    } catch (error: unknown) {
        if (error instanceof Error) {
            alert(`При получении обратной связи возникла ошибка: ${error.message}`)
        } else {
            alert("При получении обратной связи возникла неизвестная ошибка")
        }
    }
}