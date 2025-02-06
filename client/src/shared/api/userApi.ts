import { $authHost, $host } from "./http"
import { jwtDecode, JwtPayload } from 'jwt-decode'

export interface CustomJwtPayload extends JwtPayload {
    id: number,
    email: string,
    role: string,
}

export const registration = async (email: string, password: string, hcaptchaToken: string) => {
    const { data } = await $host.post('api/user/registration', { email, password, role: 'USER', hcaptchaToken })
    localStorage.setItem('token', data.token)
    return jwtDecode<CustomJwtPayload>(data.token)
}

export const login = async (email: string, password: string, hcaptchaToken: string) => {
    const { data } = await $host.post('api/user/login', { email, password, hcaptchaToken })
    localStorage.setItem('token', data.token)
    return jwtDecode<CustomJwtPayload>(data.token)
}

export const check = async () => {
    const { data } = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode<CustomJwtPayload>(data.token)
}

export const getUser = async (userId: number) => {
    const { data } = await $authHost.get(`api/user/${userId}`)
    return data
}

export const updateUserInfo = async (userId: number, email: string, password: string) => {
    const { data } = await $authHost.put(`api/user/info`, { userId, email, password })
    localStorage.setItem('token', data.token)
    return jwtDecode<CustomJwtPayload>(data.token)
}

export const updateUserImage = async (userId: number, formData: FormData) => {
    const { data } = await $authHost.put(`api/user/${userId}/image`, formData);
    return data
}

export const deleteUserImage = async (userId: number) => {
    const { data } = await $authHost.put(`api/user/image`, { userId });
    return data
}

// Admin

export const getUsers = async () => {
    const { data } = await $authHost.get('api/user/')
    return data
}

export const createUser = async (email: string, password: string, role: string) => {
    const { data } = await $authHost.post('api/user/', { email, password, role })
    return data
}

export const updateUser = async (userId: number, email: string, password: string, role: string) => {
    const { data } = await $authHost.put(`api/user/`, { userId, email, password, role })
    return data
}

export const deleteUser = async (userId: number) => {
    const { data } = await $authHost.delete(`api/user/${userId}`)
    return data
}