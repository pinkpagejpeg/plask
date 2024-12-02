import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IChangeUserReturnedValue, IUser, IUserState } from "./types"
import { changeUserImage, changeUserInfo, destroyUser, destroyUserImage, fetchUserById } from "../api"

const initialState: IUserState = {
    user: null,
    isAuth: false,
    authLoading: false,
    authError: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuthTrue(state, action) {
            // state.user = action.payload
            // state.isAuth = true
        },
        setAuthFalse(state) {
            // state.user = null
            // state.isAuth = false
        },
        setAuthLoading(state, action) {
            // state.authLoading = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchUserById
            .addCase(fetchUserById.pending, (state) => {
                state.authLoading = true
            })
            .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.user = action.payload
                state.isAuth = true
                state.authLoading = false
            })
            .addCase(fetchUserById.rejected, (state, action: PayloadAction<string>) => {
                state.authLoading = false
                state.authError = action.payload
            })

            // changeUserImage
            .addCase(changeUserImage.pending, (state) => {
                state.authLoading = true
            })
            .addCase(changeUserImage.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.user = {...action.payload}
                state.authLoading = false
            })
            .addCase(changeUserImage.rejected, (state, action: PayloadAction<string>) => {
                state.authLoading = false
                state.authError = action.payload
            })

            // changeUserInfo
            .addCase(changeUserInfo.pending, (state) => {
                state.authLoading = true
            })
            .addCase(changeUserInfo.fulfilled, (state, action: PayloadAction<IChangeUserReturnedValue>) => {
                state.user.email = action.payload.email
                state.authLoading = false
            })
            .addCase(changeUserInfo.rejected, (state, action: PayloadAction<string>) => {
                state.authLoading = false
                state.authError = action.payload
            })

            // destroyUserImage
            .addCase(destroyUserImage.pending, (state) => {
                state.authLoading = true
            })
            .addCase(destroyUserImage.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.user = {...action.payload}
                state.authLoading = false
            })
            .addCase(destroyUserImage.rejected, (state, action: PayloadAction<string>) => {
                state.authLoading = false
                state.authError = action.payload
            })

            // destroyUser
            .addCase(destroyUser.pending, (state) => {
                state.authLoading = true
            })
            .addCase(destroyUser.fulfilled, (state, action: PayloadAction<number>) => {
                state.user = null
                state.isAuth = false
                state.authLoading = false
            })
            .addCase(destroyUser.rejected, (state, action: PayloadAction<string>) => {
                state.authLoading = false
                state.authError = action.payload
            })
    }
})

export const { setAuthTrue, setAuthFalse, setAuthLoading } = userSlice.actions
export default userSlice.reducer

// import { makeAutoObservable } from 'mobx'

// export default class UserStore {
//     constructor() {
//         this._isAuth = false
//         this._user = {}
//         makeAutoObservable(this)
//     }

//     setIsAuth(bool) {
//         this._isAuth = bool
//     }

//     setUser(user) {
//         this._user = user
//     }

//     editUser(userId, updatedUser) {
//         if (this._user.id === userId) {
//             return updatedUser;
//         }
//         return user;
//     }

//     get isAuth() {
//         return this._isAuth
//     }

//     get user() {
//         return this._user
//     }
// }