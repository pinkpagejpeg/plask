import { createAsyncThunk } from "@reduxjs/toolkit"
import { deleteAccount } from "../../../shared/api"

export const destroyUser = createAsyncThunk<number, void, { rejectValue: string }>(
    "user/destroyUser",
    async (_, { rejectWithValue }) => {
        try {
            const data = await deleteAccount()
            return data
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)