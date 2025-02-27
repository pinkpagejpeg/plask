import { fetchAppeals } from "../fetchAppeals"
import { getFeedbacks } from "@/shared/api"

jest.mock("@/shared/api", () => ({
    getFeedbacks: jest.fn(),
}))

describe('fetchAppeals tests', () => {
    let mockData
    // let mockError

    beforeAll(() => {
        mockData = {
            data: {
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
        }

        // mockError = { response: { data: 'Неправильный запрос' } }
    })

    test('Get data of users appeals', async () => {
        (getFeedbacks as jest.Mock).mockResolvedValue(mockData)
        const data = await fetchAppeals()
        expect(data).toEqual(mockData)
        expect(getFeedbacks).toHaveBeenCalledTimes(1)
    })

    // test('Get error', async () => {
    //     (getFeedbacks as jest.Mock).mockResolvedValue(mockError)
    //     const data = await fetchAppeals()
    //     expect(data).toEqual(mockError)
    //     expect(global.console).toHaveBeenCalledWith('Ошибка при получении обратной связи: Неправильный запрос')
    // })
})