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

export const getInfo = async () => {
    const { data } = await $authHost.get(`api/user/`)
    return data
}

export const updateInfo = async (email: string, password: string) => {
    const { data } = await $authHost.patch(`api/user/info`, { email, password })
    localStorage.setItem('token', data.token)
    return jwtDecode<CustomJwtPayload>(data.token)
}

export const updateImage = async (formData: FormData) => {
    const { data } = await $authHost.patch(`api/user/image`, formData)
    return data
}

export const deleteImage = async () => {
    const { data } = await $authHost.delete(`api/user/image`)
    return data
}

export const deleteAccount = async () => {
    const { data } = await $authHost.delete(`api/user/`)
    return data
}