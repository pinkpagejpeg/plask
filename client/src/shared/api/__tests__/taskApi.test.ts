import { $authHost } from "../http"
import { createTask, deleteTask, getTask, updateTask, updateTaskStatus } from "../taskApi"
import { checkApi } from "./checkApi"

interface IMockTaskData {
    data: {
        tasks: IMockTask[],
        count: number
    }
}

interface IMockTask {
    id: number,
    info: string,
    status: boolean,
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

describe('taskApi tests', () => {
    let mockData: IMockTaskData,
        createdMockData: IMockTask,
        updatedMockData: IMockTask,
        updatedStatusMockData: IMockTask

    beforeAll(() => {
        mockData = {
            data: {
                tasks: [
                    {
                        id: 28,
                        info: "Set up the project structure",
                        status: true,
                        userId: 19,
                        createdAt: "2025-01-26 13:48:44.315+03",
                        updatedAt: "2025-01-26 13:48:44.315+03",
                    },
                    {
                        id: 29,
                        info: 'Write the first chapter of documentation',
                        status: false,
                        userId: 19,
                        createdAt: "2025-01-26 13:48:44.315+03",
                        updatedAt: "2025-01-26 13:48:44.315+03",
                    }
                ],
                count: 2
            }
        }

        createdMockData = {
            id: 30,
            info: 'Add tests',
            status: false,
            userId: 19,
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        updatedMockData = { ...createdMockData, info: 'Add ui' }

        updatedStatusMockData = { ...updatedMockData, status: true }
    })

    test('Create task api', async () => {
        await checkApi(
            $authHost.post as jest.Mock,
            createTask,
            createdMockData,
            [`api/task/`, { userId: 19, info: 'Add tests' }],
            [19, 'Add tests']
        )
    })

    test('Update task api', async () => {
        await checkApi(
            $authHost.patch as jest.Mock,
            updateTask,
            updatedMockData,
            [`api/task/30`, { info: 'Add ui' }],
            [30, 'Add ui']
        )
    })

    test('Update task status api', async () => {
        await checkApi(
            $authHost.patch as jest.Mock,
            updateTaskStatus,
            updatedStatusMockData,
            [`api/task/30/status`, { status: true }],
            [30, true]
        )

        await checkApi(
            $authHost.patch as jest.Mock,
            updateTaskStatus,
            updatedMockData,
            [`api/task/30/status`, { status: false }],
            [30, false],
            2
        )
    })

    test('Delete task api', async () => {
        await checkApi(
            $authHost.delete as jest.Mock,
            deleteTask,
            { deletedTaskId: 30 },
            [`api/task/30`],
            [30]
        )
    })

    test('Get tasks api', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getTask,
            mockData,
            [`api/task/user/19`],
            [19]
        )
    })

    afterEach(() => jest.clearAllMocks())
})