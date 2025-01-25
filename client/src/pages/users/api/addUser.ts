import { createUser } from "../../../shared/api"
import { IAddUser } from "../model"

export const addUser = async ({ email, password, role }: IAddUser) => {
    try {
        await createUser(email, password, role)
    }
    catch (error) {
        alert(`Ошибка при добавлении пользователя: ${error.response.data}`)
    }
}