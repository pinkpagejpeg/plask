import { deleteUser } from "../../../shared/api"

export const destroyUser = async (userId: number) => {
    try {
        await deleteUser(userId)
    }
    catch (error) {
        alert(`Ошибка при удалении пользователя: ${error.response.data}`)
    }
}