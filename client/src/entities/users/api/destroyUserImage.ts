import { createAsyncThunk } from "@reduxjs/toolkit"
import { deleteUserImage } from "../../../shared/api"
import { IUser } from "../model"

export const destroyUserImage = createAsyncThunk<IUser, number, { rejectValue: string }>(
    "user/destroyUserImage",
    async (userId, { rejectWithValue }) => {
        try {
            const { user } = await deleteUserImage(userId)
            return user
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)