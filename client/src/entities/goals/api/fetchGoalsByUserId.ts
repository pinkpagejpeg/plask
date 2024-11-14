import { createAsyncThunk } from "@reduxjs/toolkit"
import { IGoal } from "../model"
import { getGoals } from "../../../shared/api"

export const fetchGoalsByUserId = createAsyncThunk<IGoal[], number, { rejectValue: string }>(
    "goal/fetchGoalsByUserId",
    async (userId, { rejectWithValue }) => {
        try {
            if (userId) {
                const data = await getGoals(userId)
                return data
            }
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)