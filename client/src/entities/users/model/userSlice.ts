import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUser, IUserState } from "./types"
import { fetchUserById } from "../api"

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
            state.user = null
            state.isAuth = false
        },
        setAuthLoading(state, action) {
            state.authLoading = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
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
                state.authError = action.payload!
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