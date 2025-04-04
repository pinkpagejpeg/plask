import { createUser } from "@/shared/api"
import { addUser } from "../addUser"
import { IMockUser } from "../../model"

jest.mock('@/shared/api', () => ({
    createUser: jest.fn()
}))

describe('addUser tests', () => {
    let mockUser: { user: IMockUser }

    beforeAll(() => {
        mockUser = {
            user: {
                id: 1,
                email: 'userTest@gmail.com',
                password: '12345678',
                role: 'USER',
                img: 'user_default_image.jpg',
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            }
        }
    })

    test('Add user on admin panel', async () => {
        (createUser as jest.Mock).mockResolvedValue(mockUser)

        await addUser({
            email: 'userTest@gmail.com',
            password: '12345678',
            role: 'USER'
        })

        expect(createUser).toHaveBeenCalledTimes(1)
        expect(createUser).toHaveBeenCalledWith('userTest@gmail.com', '12345678', 'USER')
    })

    test('Add user on admin panel with error', async () => {
        const errorMessage = 'Пользователь с таким именем уже существует';
        (createUser as jest.Mock).mockRejectedValue(new Error(errorMessage))
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await addUser({
            email: 'userTest@gmail.com',
            password: '12345678',
            role: 'USER'
        })

        expect(createUser).toHaveBeenCalledTimes(1)
        expect(createUser).toHaveBeenCalledWith('userTest@gmail.com', '12345678', 'USER')
        expect(alertSpy).toHaveBeenCalledWith(`При добавлении пользователя возникла ошибка: ${errorMessage}`)
    })

    test('Add user on admin panel with unknown error', async () => {
        (createUser as jest.Mock).mockRejectedValue('Unexpected value')
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await addUser({
            email: 'userTest@gmail.com',
            password: '12345678',
            role: 'USER'
        })

        expect(createUser).toHaveBeenCalledTimes(1)
        expect(createUser).toHaveBeenCalledWith('userTest@gmail.com', '12345678', 'USER')
        expect(alertSpy).toHaveBeenCalledWith('При добавлении пользователя возникла неизвестная ошибка')
    })

    afterEach(() => jest.clearAllMocks())
})