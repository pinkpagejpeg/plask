import { createAsyncThunk } from "@reduxjs/toolkit"
import { getGoalProgress, getGoals } from "../../../shared/api"
import { IGoals } from "../model/types"

export const fetchGoalsByUserId = createAsyncThunk<IGoals, { search?: string } | void, { rejectValue: string }>(
    "goal/fetchGoalsByUserId",
    async (arg, { rejectWithValue }) => {
        try {
            const { goals, count } = await getGoals(arg && arg?.search)
            const data = await Promise.all(
                goals.map(async (goal) => {
                    const { progress } = await getGoalProgress(goal.id)
                    return { ...goal, progress }
                })
            )
            return { goals: data, count }
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)