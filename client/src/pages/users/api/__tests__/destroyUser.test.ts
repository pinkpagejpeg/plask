import { deleteUser } from "@/shared/api"
import { destroyUser } from "../destroyUser"

jest.mock('@/shared/api', () => ({
    deleteUser: jest.fn()
}))

describe('destroyUser tests', () => {
    test('Destroy user on admin panel', async () => {
        (deleteUser as jest.Mock).mockResolvedValue({ deletedUserId: 1 })

        await destroyUser(1)

        expect(deleteUser).toHaveBeenCalledTimes(1)
        expect(deleteUser).toHaveBeenCalledWith(1)
    })

    test('Destroy user on admin panel with error', async () => {
        const errorMessage = 'Пользователь не найден';
        (deleteUser as jest.Mock).mockRejectedValue(new Error(errorMessage))
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await destroyUser(1)

        expect(deleteUser).toHaveBeenCalledTimes(1)
        expect(deleteUser).toHaveBeenCalledWith(1)
        expect(alertSpy).toHaveBeenCalledWith(`При удалении пользователя возникла ошибка: ${errorMessage}`)
    })

    test('Destroy user on admin panel with unknown error', async () => {
        (deleteUser as jest.Mock).mockRejectedValue('Unexpected value')
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await destroyUser(1)

        expect(deleteUser).toHaveBeenCalledTimes(1)
        expect(deleteUser).toHaveBeenCalledWith(1)
        expect(alertSpy).toHaveBeenCalledWith('При удалении пользователя возникла неизвестная ошибка')
    })

    afterEach(() => jest.clearAllMocks())
})