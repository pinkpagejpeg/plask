import { createAsyncThunk } from "@reduxjs/toolkit"
import { updateTaskStatus } from "../../../shared/api"
import { ITask } from "../model"

export const changeTaskStatus = createAsyncThunk<ITask, { taskId: number, status: boolean }, { rejectValue: string }>(
    "task/changeTaskStatus",
    async ({ taskId, status }, { rejectWithValue }) => {
        try {
            const data = await updateTaskStatus(taskId, status)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)