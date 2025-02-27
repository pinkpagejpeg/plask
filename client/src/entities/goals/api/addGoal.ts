import { createAsyncThunk } from "@reduxjs/toolkit"
import { createGoal } from "../../../shared/api"
import { IGoal } from "../model"

export const addGoal = createAsyncThunk<IGoal, { info: string }, { rejectValue: string }>(
    "goal/addGoal",
    async ({ info }, { rejectWithValue }) => {
        try {
            const { goal } = await createGoal(info)
            goal.progress = 0
            return goal
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)