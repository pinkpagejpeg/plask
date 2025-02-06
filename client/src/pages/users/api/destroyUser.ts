import { deleteUser } from "../../../shared/api"

export const destroyUser = async (userId: number) => {
    try {
        await deleteUser(userId)
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            alert(`При удалении пользователя возникла ошибка: ${error.message}`)
        } else {
            alert("При удалении пользователя возникла неизвестная ошибка")
        }
    }
}