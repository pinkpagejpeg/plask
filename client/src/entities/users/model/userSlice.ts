import { createSlice } from "@reduxjs/toolkit"
import { IUserState } from "./types"

const initialState: IUserState = {
    user: null,
    isAuth: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuthTrue(state, action) {
            state.user = action.payload
            state.isAuth = true
        },
        setAuthFalse(state) {
            state.user = null
            state.isAuth = false
        }
    }
})

export const { setAuthTrue, setAuthFalse } = userSlice.actions
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