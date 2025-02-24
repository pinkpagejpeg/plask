import { createFeedback, getFeedback, updateFeedbackStatus } from "../feedbackApi"
import { $authHost } from "../http"
import { checkApi } from "./checkApi"

interface IMockFeedbackData {
    data: {
        feedbacks: IMockFeedback[],
        count: number
    }
}

interface IMockFeedback {
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
        patch: jest.fn(),
        get: jest.fn(),
    }
}))

describe('feedbackApi tests', () => {
    let mockData: IMockFeedbackData,
        updatedMockData: IMockFeedback,
        createdMockData: IMockFeedback

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

        updatedMockData = { ...mockData.data.feedbacks[1], status: true }

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
            $authHost.patch as jest.Mock,
            updateFeedbackStatus,
            updatedMockData,
            [`api/feedback/3`, { status: true }],
            [3, true],
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