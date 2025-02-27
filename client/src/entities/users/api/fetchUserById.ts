import { createAsyncThunk } from "@reduxjs/toolkit"
import { getInfo } from "../../../shared/api"
import { IUser } from "../model"

export const fetchUserById = createAsyncThunk<IUser, void, { rejectValue: string }>(
    "user/fetchUserById",
    async (_, { rejectWithValue }) => {
        try {
            const { user } = await getInfo()
            return user
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)