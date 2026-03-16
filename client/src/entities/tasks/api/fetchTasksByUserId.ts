import { createAsyncThunk } from "@reduxjs/toolkit"
import { getTasks } from "../../../shared/api"
import { ITasks } from "../model/types"

type TFetchTasksParams = {
    search?: string
    filter?: string
}

export const fetchTasksByUserId = createAsyncThunk<ITasks, TFetchTasksParams, { rejectValue: string }>(
    "task/fetchTasksByUserId",
    async (params, { rejectWithValue }) => {
        try {
            const data = await getTasks(params.search, params.filter)
            return data
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)