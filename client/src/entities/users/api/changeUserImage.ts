import { createAsyncThunk } from "@reduxjs/toolkit"
import { updateImage } from "../../../shared/api"
import { IUser } from "../model"

export const changeUserImage = createAsyncThunk<IUser, { formData: FormData }, { rejectValue: string }>(
    "user/changeUserImage",
    async ({ formData }, { rejectWithValue }) => {
        try {
            const { user } = await updateImage(formData)
            return user
        } catch (error: unknown) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Неизвестная ошибка')
        }
    }
)