import { createAsyncThunk } from "@reduxjs/toolkit"
import { getTasks } from "../../../shared/api"
import { ITasks } from "../model/types"

export const fetchTasksByUserId = createAsyncThunk<ITasks, { search?: string } | void, { rejectValue: string }>(
    "task/fetchTasksByUserId",
    async (arg, { rejectWithValue }) => {
        try {
            const data = await getTasks(arg && arg?.search)
            return data
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)