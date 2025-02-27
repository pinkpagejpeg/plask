import { createAsyncThunk } from "@reduxjs/toolkit"
import { getTasks } from "../../../shared/api"
import { ITasks } from "../model/types"

export const fetchTasksByUserId = createAsyncThunk<ITasks, void, { rejectValue: string }>(
    "task/fetchTasksByUserId",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getTasks()
            return data
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)