import { createAsyncThunk } from "@reduxjs/toolkit"
import { updateInfo } from "../../../shared/api"
import { IChangeUserReturnedValue } from "../model"

export const changeUserInfo = createAsyncThunk<IChangeUserReturnedValue, { email: string, password: string }, { rejectValue: string }>(
    "user/changeUserInfo",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const data = await updateInfo(email, password)
            return data
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)