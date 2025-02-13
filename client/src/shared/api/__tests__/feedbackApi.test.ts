import { createFeedback, getFeedback, updateFeedbackStatus } from "../feedbackApi"
import { $authHost } from "../http"
import { checkApi } from "./checkApi"

interface IMockFeedbackData {
    id: number,
    info: string,
    date: string,
    status: boolean,
    userId: number,
    createdAt: string,
    updatedAt: string,
}

jest.mock('../http', () => ({
    $authHost: {
        post: jest.fn(),
        put: jest.fn(),
        get: jest.fn(),
    }
}))

describe('feedbackApi tests', () => {
    let mockData: IMockFeedbackData[],
        updatedMockData: IMockFeedbackData,
        createdMockData: IMockFeedbackData

    beforeAll(() => {
        mockData = [
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
        ]

        updatedMockData = { ...mockData[1], status: true }

        createdMockData = {
            id: 4,
            info: "Thank you for fixing my problem!",
            date: "2025-01-28",
            status: true,
            userId: 18,
            createdAt: "2025-01-26 13:48:44.241+03",
            updatedAt: "2025-01-26 13:48:44.241+03",
        }
    })

    test('Create feedback api', async () => {
        await checkApi(
            $authHost.post as jest.Mock,
            createFeedback,
            createdMockData,
            [`api/feedback/`, { userId: 18, info: 'Thank you for fixing my problem!' }],
            [18, 'Thank you for fixing my problem!'],
        )
    })

    test('Update feedback api', async () => {
        await checkApi(
            $authHost.put as jest.Mock,
            updateFeedbackStatus,
            updatedMockData,
            [`api/feedback/`, { feedbackId: 3 }],
            [3],
        )
    })

    test('Get feedback api', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getFeedback,
            mockData,
            [`api/feedback/`],
        )
    })

    afterEach(() => jest.clearAllMocks())
})