import { createAsyncThunk } from "@reduxjs/toolkit"
import { createGoal } from "../../../shared/api"
import { IGoal } from "../model"

export const addGoal = createAsyncThunk<IGoal, { userId: number; info: string }, { rejectValue: string }>(
    "goal/addGoal",
    async ({ userId, info }, { rejectWithValue }) => {
        try {
            if (!userId) {
                throw new Error("Отсутствует идентификатор пользователя")
            }

            const { goal } = await createGoal(userId, info)
            goal.progress = 0
            return goal
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)