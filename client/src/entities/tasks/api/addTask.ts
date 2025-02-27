import { createAsyncThunk } from "@reduxjs/toolkit"
import { createTask } from "../../../shared/api"
import { ITask } from "../model"

export const addTask = createAsyncThunk<ITask, { info: string }, { rejectValue: string }>(
    "task/addTask",
    async ({ info }, { rejectWithValue }) => {
        try {
            const { task } = await createTask(info)
            return task
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)