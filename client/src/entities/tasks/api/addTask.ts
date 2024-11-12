import { createAsyncThunk } from "@reduxjs/toolkit"
import { createTask } from "../../../shared/api"
import { ITask } from "../model"

export const addTask = createAsyncThunk<ITask, { userId: number; info: string }, { rejectValue: string }>(
    "task/addTask",
    async ({ userId, info }, { rejectWithValue }) => {
        try {
            const data = await createTask(userId, info)
            return data
        }
        catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)