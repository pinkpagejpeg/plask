import { createAsyncThunk } from "@reduxjs/toolkit"
import { getGoalProgress, getGoals } from "../../../shared/api"
import { IGoal, IGoals } from "../model/types"

export const fetchGoalsByUserId = createAsyncThunk<IGoals, { search?: string } | void, { rejectValue: string }>(
    "goal/fetchGoalsByUserId",
    async (arg, { rejectWithValue }) => {
        try {
            const search = arg && typeof arg === 'object' ? arg.search : undefined
            const { goals, count } = await getGoals(search)
            const data = await Promise.all(
                goals.map(async (goal: IGoal) => {
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