import { updateUser } from "@/shared/api"
import { changeUser } from "../changeUser"
import { IMockUser } from "../../model"

jest.mock('@/shared/api', () => ({
    updateUser: jest.fn()
}))

describe('changeUser tests', () => {
    let mockUser: { user: IMockUser }

    beforeAll(() => {
        mockUser = {
            user: {
                id: 1,
                email: 'change@gmail.com',
                password: '12345678',
                role: 'USER',
                img: 'user_default_image.jpg',
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            }
        }
    })

    test('Change user on admin panel', async () => {
        (updateUser as jest.Mock).mockResolvedValue(mockUser)

        await changeUser({
            userId: 1,
            email: 'change@gmail.com',
            password: '12345678',
            role: 'USER'
        })
        expect(updateUser).toHaveBeenCalledTimes(1)
        expect(updateUser).toHaveBeenCalledWith(1, 'change@gmail.com', '12345678', 'USER')
    })

    test('Change user on admin panel with error', async () => {
        const errorMessage = 'Пользователь не найден';
        (updateUser as jest.Mock).mockRejectedValue(new Error(errorMessage))
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await changeUser({
            userId: 1,
            email: 'change@gmail.com',
            password: '12345678',
            role: 'USER'
        })

        expect(updateUser).toHaveBeenCalledTimes(1)
        expect(updateUser).toHaveBeenCalledWith(1, 'change@gmail.com', '12345678', 'USER')
        expect(alertSpy).toHaveBeenCalledWith(`При изменении пользователя возникла ошибка: ${errorMessage}`)
    })

    test('Change user on admin panel with unknown error', async () => {
        (updateUser as jest.Mock).mockRejectedValue('Unexpected value')
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await changeUser({
            userId: 1,
            email: 'change@gmail.com',
            password: '12345678',
            role: 'USER'
        })

        expect(updateUser).toHaveBeenCalledTimes(1)
        expect(updateUser).toHaveBeenCalledWith(1, 'change@gmail.com', '12345678', 'USER')
        expect(alertSpy).toHaveBeenCalledWith('При изменении пользователя возникла неизвестная ошибка')
    })

    afterEach(() => jest.clearAllMocks())
})