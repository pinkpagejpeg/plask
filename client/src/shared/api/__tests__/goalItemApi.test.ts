import {
    createGoalItem,
    deleteGoalItem,
    getGoalItems,
    updateGoalItem,
    updateGoalItemStatus
} from "../goalItemApi"
import { $authHost } from "../http"
import { checkApi, checkApiError } from "./checkApi"

interface IMockSubgoalData {
    goalItems: IMockSubgoal[],
    count: number
}

interface IMockSubgoal {
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
        patch: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
    }
}))

describe('goalItemApi tests', () => {
    let mockData: IMockSubgoalData,
        createdMockData: { goalItem: IMockSubgoal },
        updatedMockData: { goalItem: IMockSubgoal },
        updatedStatusMockData: { goalItem: IMockSubgoal }

    beforeAll(() => {
        mockData = {
            goalItems: [
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
            ],
            count: 2
        }

        createdMockData = {
            goalItem: {
                id: 16,
                info: 'Add unit test',
                status: false,
                goalId: 19,
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            }
        }

        updatedMockData = {
            goalItem: {
                ...createdMockData.goalItem, info: 'Add unit and screenshot tests'
            }
        }
        
        updatedStatusMockData = {
            goalItem: {
                ...updatedMockData.goalItem, status: true
            }
        }
    })

    test('Create subgoal goal api', async () => {
        await checkApi(
            $authHost.post as jest.Mock,
            createGoalItem,
            createdMockData,
            [`api/goal/19/items`, { info: 'Add unit test' }],
            [19, 'Add unit test']
        )
    })

    test('Create subgoal with error', async () => {
        await checkApiError(
            $authHost.post as jest.Mock,
            createGoalItem,
            [`api/goal/19/items`, { info: 'Add unit test' }],
            [19, 'Add unit test']
        )
    })

    test('Update subgoal goal api', async () => {
        await checkApi(
            $authHost.patch as jest.Mock,
            updateGoalItem,
            updatedMockData,
            [`api/goal/19/items/16`, { info: 'Add unit and screenshot tests' }],
            [19, 16, 'Add unit and screenshot tests']
        )
    })

    test('Update subgoal with error', async () => {
        await checkApiError(
            $authHost.patch as jest.Mock,
            updateGoalItem,
            [`api/goal/19/items/16`, { info: 'Add unit and screenshot tests' }],
            [19, 16, 'Add unit and screenshot tests']
        )
    })

    test('Update subgoal status goal api', async () => {
        await checkApi(
            $authHost.patch as jest.Mock,
            updateGoalItemStatus,
            updatedStatusMockData,
            [`api/goal/19/items/16/status`, { status: true }],
            [19, 16, true]
        )

        await checkApi(
            $authHost.patch as jest.Mock,
            updateGoalItemStatus,
            updatedMockData,
            [`api/goal/19/items/16/status`, { status: false }],
            [19, 16, false],
            2
        )
    })

    test('Update subgoal status with error', async () => {
        await checkApiError(
            $authHost.patch as jest.Mock,
            updateGoalItemStatus,
            [`api/goal/19/items/16/status`, { status: true }],
            [19, 16, true]
        )
    })

    test('Delete subgoal goal api', async () => {
        await checkApi(
            $authHost.delete as jest.Mock,
            deleteGoalItem,
            { deletedGoalItemId: 16 },
            [`api/goal/19/items/16`],
            [19, 16]
        )
    })

    test('Delete subgoal with error', async () => {
        await checkApiError(
            $authHost.delete as jest.Mock,
            deleteGoalItem,
            [`api/goal/19/items/16`],
            [19, 16]
        )
    })

    test('Get subgoals goal api', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getGoalItems,
            mockData,
            [`api/goal/19/items`],
            [19]
        )
    })

    test('Get subgoals with error', async () => {
        await checkApiError(
            $authHost.get as jest.Mock,
            getGoalItems,
            [`api/goal/19/items`],
            [19]
        )
    })

    afterEach(() => jest.clearAllMocks())
})