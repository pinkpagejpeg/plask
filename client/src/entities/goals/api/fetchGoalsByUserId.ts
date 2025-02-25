import { createAsyncThunk } from "@reduxjs/toolkit"
import { getGoalProgress, getGoals } from "../../../shared/api"
import { IGoals } from "../model/types"

export const fetchGoalsByUserId = createAsyncThunk<IGoals, number, { rejectValue: string }>(
    "goal/fetchGoalsByUserId",
    async (userId, { rejectWithValue }) => {
        try {
            if (!userId) {
                throw new Error("Отсутствует идентификатор пользователя")
            }

            const { goals, count } = await getGoals(userId)
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