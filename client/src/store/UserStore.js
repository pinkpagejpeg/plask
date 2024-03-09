import { makeAutoObservable } from 'mobx'

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        // console.log("Setting isAuth to:", bool);
        this._isAuth = bool
    }

    setUser(user) {
        // console.log("Setting user to:", user);
        this._user = user
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }
}