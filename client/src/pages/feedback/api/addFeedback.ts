import { createFeedback } from "../../../shared/api"
import { IAddFeedback } from "../model"

export const addFeedback = async ({ info }: IAddFeedback) => {
    try {
        const { feedback } = await createFeedback(info)
        return feedback
    } catch (error: unknown) {
        if (error instanceof Error) {
            alert(`При отправке обратной связи возникла ошибка: ${error.message}`)
        } else {
            alert("При отправке обратной связи возникла неизвестная ошибка")
        }
    }
}