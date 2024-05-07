import { makeAutoObservable } from 'mobx'

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._userImage = ""
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setUserImage(img) {
        this._userImage = img
    }

    setUser(user) {
        this._user = user
    }

    editUser(userId, updatedEmail) {
        if (this._user.id === userId) {
            this._user = { ...this._user, email: updatedEmail };
            return this._user;
        }
        return this._user; 
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }

    get userImage() {
        return this._userImage
    }
}