import { createAsyncThunk } from "@reduxjs/toolkit"
import { updateUserImage } from "../../../shared/api"
import { IUser } from "../model"

export const changeUserImage = createAsyncThunk<IUser, { userId: number, formData: any }, { rejectValue: string }>(
    "user/changeUserImage",
    async ({ userId, formData }, { rejectWithValue }) => {
        try {
            const { user } = await updateUserImage(userId, formData)
            return user
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)