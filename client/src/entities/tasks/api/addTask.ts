import { createAsyncThunk } from "@reduxjs/toolkit"
import { createTask } from "../../../shared/api"
import { ITask } from "../model"

export const addTask = createAsyncThunk<ITask, { userId: number; info: string }, { rejectValue: string }>(
    "task/addTask",
    async ({ userId, info }, { rejectWithValue }) => {
        try {
            if (!userId) {
                throw new Error("Отсутствует идентификатор пользователя")
            }

            const { task } = await createTask(userId, info)
            return task
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)