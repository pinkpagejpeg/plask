import { $authHost } from "../http"
import { createTask, deleteTask, getTasks, updateTask, updateTaskStatus } from "../taskApi"
import { checkApi, checkApiError } from "./checkApi"

interface IMockTaskData {
    tasks: IMockTask[],
    count: number
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
        createdMockData: { task: IMockTask },
        updatedMockData: { task: IMockTask },
        updatedStatusMockData: { task: IMockTask }

    beforeAll(() => {
        mockData = {
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

        createdMockData = {
            task: {
                id: 30,
                info: 'Add tests',
                status: false,
                userId: 19,
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            }
        }

        updatedMockData = { task: { ...createdMockData.task, info: 'Add ui' } }

        updatedStatusMockData = { task: { ...updatedMockData.task, status: true } }
    })

    test('Create task api', async () => {
        await checkApi(
            $authHost.post as jest.Mock,
            createTask,
            createdMockData,
            [`api/task/`, { info: 'Add tests' }],
            ['Add tests']
        )
    })

    test('Create task with error', async () => {
        await checkApiError(
            $authHost.post as jest.Mock,
            createTask,
            [`api/task/`, { info: 'Add tests' }],
            ['Add tests']
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

    test('Update task with error', async () => {
        await checkApiError(
            $authHost.patch as jest.Mock,
            updateTask,
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

    test('Update task status with error', async () => {
        await checkApiError(
            $authHost.patch as jest.Mock,
            updateTaskStatus,
            [`api/task/30/status`, { status: true }],
            [30, true]
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

    test('Delete task with error', async () => {
        await checkApiError(
            $authHost.delete as jest.Mock,
            deleteTask,
            [`api/task/30`],
            [30]
        )
    })

    test('Get tasks api', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getTasks,
            mockData,
            [`api/task/user`, { "params": { "search": undefined } }],
        )
    })

    test('Get tasks with error', async () => {
        await checkApiError(
            $authHost.get as jest.Mock,
            getTasks,
            [`api/task/user`, { "params": { "search": undefined } }],
        )
    })

    afterEach(() => jest.clearAllMocks())
})