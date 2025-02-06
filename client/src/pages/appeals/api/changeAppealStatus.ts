import { updateFeedbackStatus } from "../../../shared/api"

export const changeAppealStatus = async (feedbackId: number) => {
    try {
        await updateFeedbackStatus(feedbackId)
    } catch (error: unknown) {
        if (error instanceof Error) {
            alert(`При изменении статуса обратной связи возникла ошибка: ${error.message}`)
        } else {
            alert("При изменении статуса обратной связи возникла неизвестная ошибка")
        }
    }
}