import { createAsyncThunk } from "@reduxjs/toolkit"
import { ITask } from "../model"
import { updateTask } from "../../../shared/api"

export const changeTask = createAsyncThunk<ITask, { taskId: number; info: string }, { rejectValue: string }>(
    "task/changeTask",
    async ({ taskId, info }, { rejectWithValue }) => {
        try {
            const { task } = await updateTask(taskId, info)
            return task
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)