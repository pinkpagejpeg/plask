import { getFeedback } from "../../../shared/api"

export const fetchAppeals = async () => {
    try {
        const data = await getFeedback()
        return data
    } catch (error: unknown) {
        if (error instanceof Error) {
            alert(`При получении обратной связи возникла ошибка: ${error.message}`)
        } else {
            alert("При получении обратной связи возникла неизвестная ошибка")
        }
    }
}