import { updateUser } from "../../../shared/api"
import { IChangeUser } from "../model"

export const changeUser = async ({ userId, email, password, role }: IChangeUser) => {
    try {
        await updateUser(userId, email, password, role)
    } catch (error: unknown) {
        if (error instanceof Error) {
            alert(`При изменении пользователя возникла ошибка: ${error.message}`)
        } else {
            alert("При изменении пользователя возникла неизвестная ошибка")
        }
    }
}