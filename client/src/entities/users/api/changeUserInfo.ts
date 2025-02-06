import { createAsyncThunk } from "@reduxjs/toolkit"
import { updateUserInfo } from "../../../shared/api"
import { IChangeUserReturnedValue } from "../model"

export const changeUserInfo = createAsyncThunk<IChangeUserReturnedValue, { userId: number, email: string, password: string }, { rejectValue: string }>(
    "user/changeUserInfo",
    async ({ userId, email, password }, { rejectWithValue }) => {
        try {
            const data = await updateUserInfo(userId, email, password)
            return data
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)