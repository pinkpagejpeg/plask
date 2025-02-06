import { createAsyncThunk } from "@reduxjs/toolkit"
import { deleteUser } from "../../../shared/api"

export const destroyUser = createAsyncThunk<number, number, { rejectValue: string }>(
    "user/destroyUser",
    async (userId, { rejectWithValue }) => {
        try {
            const data = await deleteUser(userId)
            return data
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)