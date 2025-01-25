import { updateUser } from "../../../shared/api"
import { IChangeUser } from "../model"

export const changeUser = async ({ userId, email, password, role }: IChangeUser) => {
    try {
        await updateUser(userId, email, password, role)
    } catch (error) {
        alert(`Ошибка при изменении пользователя: ${error.response.data}`)
    }
}