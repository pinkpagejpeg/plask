import { getUsers } from "@/shared/api"
import { fetchUsers } from "../fetchUsers"
import { IMockUser } from "../../model"

jest.mock('@/shared/api', () => ({
    getUsers: jest.fn()
}))

describe('fetchUsers tests', () => {
    let mockData: { users: IMockUser[], count: number }

    beforeAll(() => {
        mockData = {
            users: [
                {
                    id: 22,
                    email: 'user@example.com',
                    password: 'hashedPassword123',
                    role: 'USER',
                    img: 'user_default_image.jpg',
                    createdAt: "2025-01-26 13:48:44.315+03",
                    updatedAt: "2025-01-26 13:48:44.315+03",
                },
                {
                    id: 23,
                    email: 'admin@example.com',
                    password: 'hashedAdminPassword123',
                    role: 'ADMIN',
                    img: 'user_default_image.jpg',
                    createdAt: "2025-01-26 13:48:44.315+03",
                    updatedAt: "2025-01-26 13:48:44.315+03",
                }
            ],
            count: 2
        }
    })

    test('Fetch users on admin panel', async () => {
        (getUsers as jest.Mock).mockResolvedValue(mockData)

        const data = await fetchUsers()

        expect(data).toEqual(mockData)
        expect(getUsers).toHaveBeenCalledTimes(1)
    })

    test('Fetch users on admin panel with error', async () => {
        const errorMessage = 'Пользователь не авторизован';
        (getUsers as jest.Mock).mockRejectedValue(new Error(errorMessage))
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await fetchUsers()

        expect(getUsers).toHaveBeenCalledTimes(1)
        expect(alertSpy).toHaveBeenCalledWith(`При получении пользователей возникла ошибка: ${errorMessage}`)
    })

    test('Fetch users on admin panel with unknown error', async () => {
        (getUsers as jest.Mock).mockRejectedValue('Unexpected value')
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { })

        await fetchUsers()

        expect(getUsers).toHaveBeenCalledTimes(1)
        expect(alertSpy).toHaveBeenCalledWith('При получении пользователей возникла неизвестная ошибка')
    })

    afterEach(() => jest.clearAllMocks())
})