import { createAsyncThunk } from "@reduxjs/toolkit"
import { getUser } from "../../../shared/api"
import { IUser } from "../model"

export const fetchUserById = createAsyncThunk<IUser, { userId: number }, { rejectValue: string }>(
    "user/fetchUserById",
    async (userId, { rejectWithValue }) => {
        try {
            const data = await getUser(userId)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)