import { createFeedback } from "../feedbackApi"
import { $authHost } from "../http"
import { checkApi, checkApiError } from "./checkApi"

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
    }
}))

describe('feedbackApi tests', () => {
    let createdMockData: IMockFeedback

    beforeAll(() => {
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
            [`api/feedback/`, { info: 'Thank you for fixing my problem!' }],
            ['Thank you for fixing my problem!'],
        )
    })

    test('Update feedback with error', async () => {
        await checkApiError(
            $authHost.post as jest.Mock,
            createFeedback,
            [`api/feedback/`, { info: 'Thank you for fixing my problem!' }],
            ['Thank you for fixing my problem!'],
        )
    })

    afterEach(() => jest.clearAllMocks())
})