import { createUser } from "../../../shared/api"
import { IAddUser } from "../model"

export const addUser = async ({ email, password, role }: IAddUser) => {
    try {
        await createUser(email, password, role)
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            alert(`При добавлении пользователя возникла ошибка: ${error.message}`)
        } else {
            alert("При добавлении пользователя возникла неизвестная ошибка")
        }
    }
}