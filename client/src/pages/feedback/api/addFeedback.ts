import { createFeedback } from "../../../shared/api"
import { IAddFeedback } from "../model"

export const addFeedback = async ({ userId, info }: IAddFeedback) => {
    try {
        await createFeedback(userId, info)
    }
    catch (error) {
        alert(`При отправке обратной связи возникла ошибка: ${error.response.data.message}`)
    }
}