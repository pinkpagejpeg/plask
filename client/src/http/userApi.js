import { $authHost, $host } from "./index"
import { jwtDecode } from 'jwt-decode'

export const registration = async (email, password, hcaptchaToken) => {
    const {data} = await $host.post('api/user/registration', { email, password, role: 'USER', hcaptchaToken })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const login = async (email, password, hcaptchaToken) => {
    const {data} = await $host.post('api/user/login', { email, password, hcaptchaToken })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const getUser = async (userId) => {
    const {data} = await $authHost.get(`api/user/${userId}`)
    return data
}

export const updateUserInfo = async (userId, email, password) => {
    const { data } = await $authHost.put(`api/user/info`, { userId, email, password })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const updateUserImage = async (userId, formData) => {
    const { data } = await $authHost.put(`api/user/${userId}/image`, formData);
    return data
}

export const deleteUserImage = async (userId) => {
    const { data } = await $authHost.put(`api/user/image`, {userId});
    return data
}

// Панель администратора

export const getUsers = async () => {
    const {data} = await $authHost.get('api/user/')
    return data
}

export const createUser = async (email, password, role) => {
    const {data} = await $authHost.post('api/user/', { email, password, role })
    return data
}

export const updateUser = async (userId, email, password, role) => {
    const { data } = await $authHost.put(`api/user/`, { userId, email, password, role })
    return data
}

export const deleteUser = async (userId) => {
    const {data} = await $authHost.delete(`api/user/${userId}`)
    return data
}