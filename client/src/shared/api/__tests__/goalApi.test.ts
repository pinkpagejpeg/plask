import { createGoal, deleteGoal, getGoal, getGoalProgress, getGoals, updateGoal } from "../goalApi"
import { $authHost } from "../http"
import { checkApi } from "./checkApi"

interface IMockGoalData {
    data: {
        goals: IMockGoal[],
        count: number
    }
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
        createdMockData: IMockGoal,
        updatedMockData: IMockGoal

    beforeAll(() => {
        mockData = {
            data: {
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
        }

        createdMockData = {
            id: 20,
            info: 'Add tests',
            userId: 19,
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        updatedMockData = { ...createdMockData, info: 'Add ui' }
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

    test('Update goal api', async () => {
        await checkApi(
            $authHost.patch as jest.Mock,
            updateGoal,
            updatedMockData,
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

    test('Get goals api', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getGoals,
            mockData,
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

    test('Get goal progress api', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getGoalProgress,
            0,
            [`api/goal/19/progress`],
            [19]
        )
    })

    afterEach(() => jest.clearAllMocks())
})