import { createAsyncThunk } from "@reduxjs/toolkit"
import { getUser } from "../../../shared/api"
import { IUser } from "../model"

export const fetchUserById = createAsyncThunk<IUser, number, { rejectValue: string }>(
    "user/fetchUserById",
    async (userId, { rejectWithValue }) => {
        try {
            const data = await getUser(userId)
            return data
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)