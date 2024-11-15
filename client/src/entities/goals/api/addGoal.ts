import { createAsyncThunk } from "@reduxjs/toolkit"
import { createGoal } from "../../../shared/api"
import { IGoal } from "../model"

export const addGoal = createAsyncThunk<IGoal, { userId: number; info: string }, { rejectValue: string }>(
    "goal/addGoal",
    async ({ userId, info }, { rejectWithValue }) => {
        try {
            const data = await createGoal(userId, info)
            data.progress = 0
            return data
        }
        catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)