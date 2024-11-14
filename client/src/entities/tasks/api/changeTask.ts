import { createAsyncThunk } from "@reduxjs/toolkit"
import { ITask } from "../model"
import { updateTask } from "../../../shared/api"

export const changeTask = createAsyncThunk<ITask, { taskId: number; info: string }, { rejectValue: string }>(
    "task/changeTask",
    async ({ taskId, info }, { rejectWithValue }) => {
        try {
            const data = await updateTask(taskId, info)
            return data

        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)