import { createAsyncThunk } from "@reduxjs/toolkit"
import { deleteTask } from "../../../shared/api"

export const destroyTask = createAsyncThunk<number, number, { rejectValue: string }>(
    "task/destroyTask",
    async (taskId, {rejectWithValue}) => {
        try {
            const data = await deleteTask(taskId)
            return data.deletedTaskId
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)