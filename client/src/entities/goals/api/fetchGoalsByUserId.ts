import { createAsyncThunk } from "@reduxjs/toolkit"
import { IGoal } from "../model"
import { getGoalProgress, getGoals } from "../../../shared/api"

export const fetchGoalsByUserId = createAsyncThunk<IGoal[], number, { rejectValue: string }>(
    "goal/fetchGoalsByUserId",
    async (userId, { rejectWithValue }) => {
        try {
            if (!userId) {
                throw new Error("Отсутствует идентификатор пользователя")
            }

            const goals = await getGoals(userId)
            const data = await Promise.all(
                goals.map(async (goal) => {
                    const progress = await getGoalProgress(goal.id)
                    return { ...goal, progress }
                })
            )
            return data
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)