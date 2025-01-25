import { updateFeedbackStatus } from "../../../shared/api"

export const changeAppealStatus = async (feedbackId) => {
    try {
        await updateFeedbackStatus(feedbackId)
    } catch (error) {
        alert(`При изменении статуса обратной связи возникла ошибка: ${error.response.data}`)
    }
}