import { createAsyncThunk } from "@reduxjs/toolkit"
import { deleteImage } from "../../../shared/api"
import { IUser } from "../model"

export const destroyUserImage = createAsyncThunk<IUser, void, { rejectValue: string }>(
    "user/destroyUserImage",
    async (_, { rejectWithValue }) => {
        try {
            const { user } = await deleteImage()
            return user
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)