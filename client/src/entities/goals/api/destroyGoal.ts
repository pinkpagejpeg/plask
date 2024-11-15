import { createAsyncThunk } from "@reduxjs/toolkit"
import { deleteGoal } from "../../../shared/api"

export const destroyGoal = createAsyncThunk<number, number, { rejectValue: string }>(
    "goal/destroyGoal",
    async (goalId, { rejectWithValue }) => {
        try {
            const data = await deleteGoal(goalId)
            return data.deletedGoalId
        }
        catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)