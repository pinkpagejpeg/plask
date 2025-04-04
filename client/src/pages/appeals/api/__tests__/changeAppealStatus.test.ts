import { updateFeedbackStatus } from "@/shared/api"
import { changeAppealStatus } from "../changeAppealStatus"
import { IMockAppeal } from "../../model"

jest.mock('@/shared/api', () => ({
    updateFeedbackStatus: jest.fn()
}))

describe('changeAppealStatus tests', () => {
    let mockFeedback: { feedback: IMockAppeal }

    beforeAll(() => {
        mockFeedback = {
            feedback: {
                id: 1,
                info: 'Great project, looking forward to the next version!',
                status: false,
                userId: 1,
                date: '2025-03-17',
                createdAt: "2025-03-17 13:48:44.315+03",
                updatedAt: "2025-03-17 13:48:44.315+03",
            }
        }
    })

    test('Change appeal status', async () => {
        (updateFeedbackStatus as jest.Mock).mockResolvedValue(mockFeedback)

        await changeAppealStatus(1, true)

        expect(updateFeedbackStatus).toHaveBeenCalledTimes(1)
        expect(updateFeedbackStatus).toHaveBeenCalledWith(1, true)
    })

    test('Change appeal status with error', async () => {
        const errorMessage = 'Пользователь не авторизован';
        (updateFeedbackStatus as jest.Mock).mockRejectedValue(new Error(errorMessage))
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await changeAppealStatus(1, true)

        expect(updateFeedbackStatus).toHaveBeenCalledTimes(1)
        expect(updateFeedbackStatus).toHaveBeenCalledWith(1, true)
        expect(alertSpy).toHaveBeenCalledWith(`При изменении статуса обратной связи возникла ошибка: ${errorMessage}`)
    })

    test('Change appeal status with unknown error', async () => {
        (updateFeedbackStatus as jest.Mock).mockRejectedValue('Unexpected value')
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await changeAppealStatus(1, true)

        expect(updateFeedbackStatus).toHaveBeenCalledTimes(1)
        expect(updateFeedbackStatus).toHaveBeenCalledWith(1, true)
        expect(alertSpy).toHaveBeenCalledWith('При изменении статуса обратной связи возникла неизвестная ошибка')
    })

    afterEach(() => jest.clearAllMocks())
})