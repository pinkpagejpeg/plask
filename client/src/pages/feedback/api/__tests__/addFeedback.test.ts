import { addFeedback } from "../addFeedback"
import { createFeedback } from "@/shared/api"

jest.mock('@/shared/api', () => ({
    createFeedback: jest.fn()
}))

beforeAll(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {})
})

describe('addFeedback tests', () => {
    test('Add user feedback', async () => {
        await addFeedback({
            info: 'Great project, looking forward to the next version!'
        })
        expect(createFeedback).toHaveBeenCalledTimes(1)
        expect(createFeedback).toHaveBeenCalledWith('Great project, looking forward to the next version!')
    })
})
