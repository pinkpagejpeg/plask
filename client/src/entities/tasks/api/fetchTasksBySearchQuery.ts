import { createAsyncThunk } from "@reduxjs/toolkit"
import { searchTasks } from "../../../shared/api"
import { ITasks } from "../model/types"

export const fetchTasksBySearchQuery = createAsyncThunk<ITasks, { searchQuery: string }, { rejectValue: string }>(
    "task/fetchTasksBySearchQuery",
    async ({searchQuery}, { rejectWithValue }) => {
        try {
            const data = await searchTasks(searchQuery)
            return data
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)