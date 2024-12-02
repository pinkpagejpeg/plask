import { createAsyncThunk } from "@reduxjs/toolkit"
import { IGoal } from "../model"
import { updateGoal } from "../../../shared/api"

export const changeGoal = createAsyncThunk<IGoal, { goalId: number, info: string }, { rejectValue: string }>(
    "goal/changeGoal",
    async ({ goalId, info }, { rejectWithValue }) => {
        try {
            const { goal } = await updateGoal(goalId, info)
            return goal
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)