import {
    createGoal,
    deleteGoal,
    getGoal,
    getGoalProgress,
    getGoals,
    updateGoal
} from "../goalApi"
import { $authHost } from "../http"
import { checkApi, checkApiError } from "./checkApi"

interface IMockGoalData {
    goals: IMockGoal[],
    count: number
}

interface IMockGoal {
    id: number,
    info: string,
    userId: number,
    createdAt: string,
    updatedAt: string,
}

jest.mock('../http', () => ({
    $authHost: {
        post: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
    }
}))

describe('goalApi tests', () => {
    let mockData: IMockGoalData,
        createdMockData: { goal: IMockGoal },
        updatedMockData: { goal: IMockGoal }

    beforeAll(() => {
        mockData = {
            goals: [
                {
                    id: 18,
                    info: 'Complete the project',
                    userId: 19,
                    createdAt: "2025-01-26 13:48:44.315+03",
                    updatedAt: "2025-01-26 13:48:44.315+03",
                },
                {
                    id: 19,
                    info: 'Write documentation',
                    userId: 19,
                    createdAt: "2025-01-26 13:48:44.315+03",
                    updatedAt: "2025-01-26 13:48:44.315+03",
                }
            ],
            count: 2
        }

        createdMockData = {
            goal: {
                id: 20,
                info: 'Add tests',
                userId: 19,
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            }
        }

        updatedMockData = { goal: { ...createdMockData.goal, info: 'Add ui' } }
    })

    test('Create goal api', async () => {
        await checkApi(
            $authHost.post as jest.Mock,
            createGoal,
            createdMockData,
            [`api/goal/`, { info: 'Add tests' }],
            ['Add tests']
        )
    })

    test('Create goal with error', async () => {
        await checkApiError(
            $authHost.post as jest.Mock,
            createGoal,
            [`api/goal/`, { info: 'Add tests' }],
            ['Add tests']
        )
    })

    test('Update goal api', async () => {
        await checkApi(
            $authHost.patch as jest.Mock,
            updateGoal,
            updatedMockData,
            [`api/goal/20`, { info: 'Add ui' }],
            [20, 'Add ui']
        )
    })

    test('Update goal with error', async () => {
        await checkApiError(
            $authHost.patch as jest.Mock,
            updateGoal,
            [`api/goal/20`, { info: 'Add ui' }],
            [20, 'Add ui']
        )
    })

    test('Delete goal api', async () => {
        await checkApi(
            $authHost.delete as jest.Mock,
            deleteGoal,
            { deletedGoalId: 20 },
            [`api/goal/20`],
            [20]
        )
    })

    test('Delete goal with error', async () => {
        await checkApiError(
            $authHost.delete as jest.Mock,
            deleteGoal,
            [`api/goal/20`],
            [20]
        )
    })

    test('Get goals api', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getGoals,
            mockData,
            [`api/goal/user`],
        )
    })

    test('Get goals with error', async () => {
        await checkApiError(
            $authHost.get as jest.Mock,
            getGoals,
            [`api/goal/user`],
        )
    })

    test('Get goal api', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getGoal,
            mockData[0],
            [`api/goal/18`],
            [18]
        )
    })

    test('Get goal with error', async () => {
        await checkApiError(
            $authHost.get as jest.Mock,
            getGoal,
            [`api/goal/18`],
            [18]
        )
    })

    test('Get goal progress api', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getGoalProgress,
            0,
            [`api/goal/19/progress`],
            [19]
        )
    })

    test('Get goal progress with error', async () => {
        await checkApiError(
            $authHost.get as jest.Mock,
            getGoalProgress,
            [`api/goal/19/progress`],
            [19]
        )
    })

    afterEach(() => jest.clearAllMocks())
})