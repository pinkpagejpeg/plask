import { getUsers } from "../../../shared/api"

export const fetchUsers = async () => {
    try {
        const data = await getUsers()
        return data
    } catch (error) {
        alert(`Ошибка при получении пользователей: ${error.response.data}`)
    }
}