import { updateUser } from "@/shared/api"
import { changeUser } from "../changeUser"


jest.mock('@/shared/api', () => ({
    updateUser: jest.fn()
}))

describe('changeUser tests', () => {
    test('Change user on admin panel', async () => {
        await changeUser({
            userId: 18,
            email: 'change@gmail.com',
            password: '123456789',
            role: 'USER'
        })
        expect(updateUser).toHaveBeenCalledTimes(1)
        expect(updateUser).toHaveBeenCalledWith(18, 'change@gmail.com', '123456789', 'USER')
    })
})