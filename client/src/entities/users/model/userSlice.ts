import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IChangeUserReturnedValue, IUser, IUserState } from "./types"
import { changeUserImage, changeUserInfo, destroyUser, destroyUserImage, fetchUserById } from "../api"
import { createPendingHandler, createRejectedHandler } from "@redux"

const initialState: IUserState = {
    user: null,
    isAuth: false,
    loading: false,
    error: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuthTrue() {
            // state.user = action.payload
            // state.isAuth = true
        },
        setAuthFalse() {
            // state.user = null
            // state.isAuth = false
        },
        setAuthLoading() {
            // state.authLoading = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchUserById
            .addCase(fetchUserById.pending, createPendingHandler<IUserState>())
            .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.user = action.payload
                state.isAuth = true
                state.loading = false
            })
            .addCase(fetchUserById.rejected, createRejectedHandler<IUserState>())

            // changeUserImage
            .addCase(changeUserImage.pending, createPendingHandler<IUserState>())
            .addCase(changeUserImage.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.user = {...action.payload}
                state.loading = false
            })
            .addCase(changeUserImage.rejected, createRejectedHandler<IUserState>())

            // changeUserInfo
            .addCase(changeUserInfo.pending, createPendingHandler<IUserState>())
            .addCase(changeUserInfo.fulfilled, (state, action: PayloadAction<IChangeUserReturnedValue>) => {
                state.user.email = action.payload.email
                state.loading = false
            })
            .addCase(changeUserInfo.rejected, createRejectedHandler<IUserState>())

            // destroyUserImage
            .addCase(destroyUserImage.pending, createPendingHandler<IUserState>())
            .addCase(destroyUserImage.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.user = {...action.payload}
                state.loading = false
            })
            .addCase(destroyUserImage.rejected, createRejectedHandler<IUserState>())

            // destroyUser
            .addCase(destroyUser.pending, createPendingHandler<IUserState>())
            .addCase(destroyUser.fulfilled, (state) => {
                state.user = null
                state.isAuth = false
                state.loading = false
            })
            .addCase(destroyUser.rejected, createRejectedHandler<IUserState>())
    }
})

export const { setAuthTrue, setAuthFalse, setAuthLoading } = userSlice.actions
export default userSlice.reducer