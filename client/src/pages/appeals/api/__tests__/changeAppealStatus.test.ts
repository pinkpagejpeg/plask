import { updateFeedbackStatus } from "@/shared/api"
import { changeAppealStatus } from "../changeAppealStatus"

jest.mock('@/shared/api', () => ({
    updateFeedbackStatus: jest.fn()
}))

describe('changeAppealStatus tests', () => {
    test('Change appeal status', async() => {
        await changeAppealStatus(2)
        expect(updateFeedbackStatus).toHaveBeenCalledTimes(1)
        expect(updateFeedbackStatus).toHaveBeenCalledWith(2)
    })
})