import { createAsyncThunk } from "@reduxjs/toolkit"
import { deleteGoal } from "../../../shared/api"

export const destroyGoal = createAsyncThunk<number, number, { rejectValue: string }>(
    "goal/destroyGoal",
    async (goalId, { rejectWithValue }) => {
        try {
            const { deletedGoalId } = await deleteGoal(goalId)
            return deletedGoalId
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)