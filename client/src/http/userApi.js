import { $authHost, $host } from "./index"
import { jwtDecode } from 'jwt-decode'

export const registration = async (email, password) => {
    const {data} = await $host.post('api/user/registration', { email, password, role: 'USER' })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', { email, password })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const getUser = async () => {
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