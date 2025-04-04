import { IMockFeedback } from "../../model"
import { addFeedback } from "../addFeedback"
import { createFeedback } from "@/shared/api"

jest.mock('@/shared/api', () => ({
    createFeedback: jest.fn()
}))

describe('addFeedback tests', () => {
    let mockFeedback: IMockFeedback

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

    test('Add user feedback', async () => {
        (createFeedback as jest.Mock).mockResolvedValue(mockFeedback)

        const data = await addFeedback({
            info: 'Great project, looking forward to the next version!'
        })

        expect(createFeedback).toHaveBeenCalledTimes(1)
        expect(createFeedback).toHaveBeenCalledWith('Great project, looking forward to the next version!')
        expect(data).toEqual(mockFeedback.feedback)
    })

    test('Add user feedback with error', async () => {
        const errorMessage = 'Пользователь не найден';
        (createFeedback as jest.Mock).mockRejectedValue(new Error(errorMessage))
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await addFeedback({
            info: 'Great project, looking forward to the next version!'
        })

        expect(createFeedback).toHaveBeenCalledTimes(1)
        expect(createFeedback).toHaveBeenCalledWith('Great project, looking forward to the next version!')
        expect(alertSpy).toHaveBeenCalledWith(`При отправке обратной связи возникла ошибка: ${errorMessage}`)
    })

    test('Add user feedback with unknown error', async () => {
        (createFeedback as jest.Mock).mockRejectedValue('Unexpected value')
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await addFeedback({
            info: 'Great project, looking forward to the next version!'
        })

        expect(createFeedback).toHaveBeenCalledTimes(1)
        expect(createFeedback).toHaveBeenCalledWith('Great project, looking forward to the next version!')
        expect(alertSpy).toHaveBeenCalledWith('При отправке обратной связи возникла неизвестная ошибка')
    })

    afterEach(() => jest.clearAllMocks())
})
