import { addFeedback } from "../addFeedback"
import { createFeedback } from "@/shared/api"

jest.mock('@/shared/api', ()=> ({
    createFeedback: jest.fn()
}))

describe('addFeedback tests', () => {
    test('Add user feedback', async ()=> {
        await addFeedback({
            userId: 18, 
            info: 'Great project, looking forward to the next version!'
        })
        expect(createFeedback).toHaveBeenCalledTimes(1)
        expect(createFeedback).toHaveBeenCalledWith(18, 'Great project, looking forward to the next version!')
    })
})