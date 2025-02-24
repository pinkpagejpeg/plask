import { createAsyncThunk } from "@reduxjs/toolkit"
import { getTask } from "../../../shared/api"
import { ITasks } from "../model/types"

export const fetchTasksByUserId = createAsyncThunk<ITasks, number, { rejectValue: string }>(
    "task/fetchTasksByUserId",
    async (userId, { rejectWithValue }) => {
        try {
            if (!userId) {
                throw new Error("Отсутствует идентификатор пользователя")
            }
            
            const data = await getTask(userId)
            return data
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)