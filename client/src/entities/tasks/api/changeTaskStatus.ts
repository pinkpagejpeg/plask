import { createAsyncThunk } from "@reduxjs/toolkit"
import { updateTaskStatus } from "../../../shared/api"
import { ITask } from "../model"

export const changeTaskStatus = createAsyncThunk<ITask, { taskId: number, status: boolean }, { rejectValue: string }>(
    "task/changeTaskStatus",
    async ({ taskId, status }, { rejectWithValue }) => {
        try {
            const { task } = await updateTaskStatus(taskId, status)
            return task
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)