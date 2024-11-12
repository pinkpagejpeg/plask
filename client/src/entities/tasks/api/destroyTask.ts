import { createAsyncThunk } from "@reduxjs/toolkit"
import { deleteTask } from "../../../shared/api"

export const destroyTask = createAsyncThunk<number, number, { rejectValue: string }>(
    "task/destroyTask",
    async (taskId, {rejectWithValue}) => {
        try {
            const data = await deleteTask(taskId)
            return data
        }
        catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)