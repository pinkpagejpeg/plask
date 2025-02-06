import { deleteUser } from "@/shared/api"
import { destroyUser } from "../destroyUser"

jest.mock('@/shared/api', () => ({
    deleteUser: jest.fn()
}))

describe('destroyUser tests', () => {
    test('Destroy user on admin panel', async () => {
        await destroyUser(17)
        expect(deleteUser).toHaveBeenCalledTimes(1)
        expect(deleteUser).toHaveBeenCalledWith(17)
    })
})