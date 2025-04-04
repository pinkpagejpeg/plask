import { IMockAppeal } from "../../model"
import { fetchAppeals } from "../fetchAppeals"
import { getFeedbacks } from "@/shared/api"

jest.mock("@/shared/api", () => ({
    getFeedbacks: jest.fn(),
}))

describe('fetchAppeals tests', () => {
    let mockData: { feedbacks: IMockAppeal[], count: number }

    beforeAll(() => {
        mockData = {
            feedbacks: [
                {
                    id: 2,
                    info: "Great project, looking forward to the next version!",
                    date: "2025-01-26",
                    status: true,
                    userId: 18,
                    createdAt: "2025-01-26 13:48:44.241+03",
                    updatedAt: "2025-01-26 13:48:44.241+03",
                },
                {
                    id: 3,
                    info: "The documentation is a bit lacking, could use more detail.",
                    date: "2025-01-26",
                    status: false,
                    userId: 18,
                    createdAt: "2025-01-26 13:48:44.241+03",
                    updatedAt: "2025-01-26 13:48:44.241+03",
                }
            ],
            count: 2
        }
    })

    test('Fetch data of users appeals', async () => {
        (getFeedbacks as jest.Mock).mockResolvedValue(mockData)

        const data = await fetchAppeals()

        expect(data).toEqual(mockData)
        expect(getFeedbacks).toHaveBeenCalledTimes(1)
    })

    test('Fetch data of users appeals with error', async () => {
        const errorMessage = 'Пользователь не авторизован';
        (getFeedbacks as jest.Mock).mockRejectedValue(new Error(errorMessage))
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await fetchAppeals()

        expect(getFeedbacks).toHaveBeenCalledTimes(1)
        expect(alertSpy).toHaveBeenCalledWith(`При получении обратной связи возникла ошибка: ${errorMessage}`)
    })

    test('Fetch data of users appeals with unknown error', async () => {
        (getFeedbacks as jest.Mock).mockRejectedValue('Unexpected value')
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await fetchAppeals()

        expect(getFeedbacks).toHaveBeenCalledTimes(1)
        expect(alertSpy).toHaveBeenCalledWith('При получении обратной связи возникла неизвестная ошибка')
    })

    afterEach(() => jest.clearAllMocks())
})