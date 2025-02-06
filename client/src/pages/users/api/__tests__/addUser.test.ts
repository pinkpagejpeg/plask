import { createUser } from "@/shared/api"
import { addUser } from "../addUser"

jest.mock('@/shared/api', () => ({
    createUser: jest.fn()
}))

describe('addUser tests', () => {
    test('Add user on admin panel', async () => {
        await addUser({
            email: 'userTest@gmail.com',
            password: '12345678',
            role: 'USER'
        })
        expect(createUser).toHaveBeenCalledTimes(1)
        expect(createUser).toHaveBeenCalledWith('userTest@gmail.com', '12345678', 'USER')
    })
})