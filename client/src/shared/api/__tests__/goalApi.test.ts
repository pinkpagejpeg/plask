import { createGoal, createGoalItem, deleteGoal, deleteGoalItem, getGoal, getGoalItems, getGoalProgress, getGoals, updateGoal, updateGoalItem, updateGoalItemStatus } from "../goalApi"
import { $authHost } from "../http"
import { checkApi } from "./checkApi"

interface IMockGoalData {
    id: number,
    info: string,
    userId: number,
    createdAt: string,
    updatedAt: string,
}

interface IMockSubgoalData {
    id: number,
    info: string,
    status: boolean,
    goalId: number,
    createdAt: string,
    updatedAt: string,
}

jest.mock('../http', () => ({
    $authHost: {
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
    }
}))

describe('goalApi tests', () => {
    let mockData: IMockGoalData[],
        createdMockData: IMockGoalData,
        updatedMockData: IMockGoalData

    beforeAll(() => {
        mockData = [
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
        ]

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
            [`api/goal/`, { userId: 19, info: 'Add tests' }],
            [19, 'Add tests']
        )
    })

    test('Update goal api', async () => {
        await checkApi(
            $authHost.put as jest.Mock,
            updateGoal,
            updatedMockData,
            [`api/goal/`, { goalId: 20, info: 'Add ui' }],
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
            [`api/goal/user/19`],
            [19]
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
            [`api/goal/progress/19`],
            [19]
        )
    })

    afterEach(() => jest.clearAllMocks())
})

describe('goalApi subgoals tests', () => {
    let mockData: IMockSubgoalData[],
        createdMockData: IMockSubgoalData,
        updatedMockData: IMockSubgoalData,
        updatedStatusMockData: IMockSubgoalData

    beforeAll(() => {
        mockData = [
            {
                id: 14,
                info: 'Complete the project setup',
                status: true,
                goalId: 18,
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            },
            {
                id: 15,
                info: 'Write the initial draft of documentation',
                status: false,
                goalId: 19,
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            }
        ]

        createdMockData = {
            id: 16,
            info: 'Add unit test',
            status: false,
            goalId: 19,
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        updatedMockData = { ...createdMockData, info: 'Add unit and screenshot tests' }

        updatedStatusMockData = { ...updatedMockData, status: true }
    })

    test('Create subgoal goal api', async () => {
        await checkApi(
            $authHost.post as jest.Mock,
            createGoalItem,
            createdMockData,
            [`api/goal/item`, { goalId: 19, info: 'Add unit test' }],
            [19, 'Add unit test']
        )
    })

    test('Update subgoal goal api', async () => {
        await checkApi(
            $authHost.put as jest.Mock,
            updateGoalItem,
            updatedMockData,
            [`api/goal/item`, { goalItemId: 16, info: 'Add unit and screenshot tests' }],
            [16, 'Add unit and screenshot tests']
        )
    })

    test('Update subgoal status goal api', async () => {
        await checkApi(
            $authHost.put as jest.Mock,
            updateGoalItemStatus,
            updatedStatusMockData,
            [`api/goal/item/status`, { goalItemId: 16, status: true }],
            [16, true]
        )

        await checkApi(
            $authHost.put as jest.Mock,
            updateGoalItemStatus,
            updatedMockData,
            [`api/goal/item/status`, { goalItemId: 16, status: false }],
            [16, false],
            2
        )
    })

    test('Delete subgoal goal api', async () => {
        await checkApi(
            $authHost.delete as jest.Mock,
            deleteGoalItem,
            { deletedGoalItemId: 16 },
            [`api/goal/item/16`],
            [16]
        )
    })

    test('Get subgoals goal api', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getGoalItems,
            mockData,
            [`api/goal/item/19`],
            [19]
        )
    })

    afterEach(() => jest.clearAllMocks())
})