import { getUsers } from "../../../shared/api"

export const fetchUsers = async () => {
    try {
        const data = await getUsers()
        return data
    } catch (error: unknown) {
        if (error instanceof Error) {
            alert(`При получении пользователя возникла ошибка: ${error.message}`)
        } else {
            alert("При получении пользователя возникла неизвестная ошибка")
        }
    }
}