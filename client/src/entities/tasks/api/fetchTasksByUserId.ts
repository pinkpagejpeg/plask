import { createAsyncThunk } from "@reduxjs/toolkit"
import { ITask } from "../model"
import { getTask } from "../../../shared/api"

export const fetchTasksByUserId = createAsyncThunk<ITask[], number, { rejectValue: string }>(
    "task/fetchTasksByUserId",
    async (userId, { rejectWithValue }) => {
        try {
            if (userId) {
                const data = await getTask(userId)
                return data
            }
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)