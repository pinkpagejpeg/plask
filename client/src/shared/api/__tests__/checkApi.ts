/* eslint-disable @typescript-eslint/no-explicit-any */
import { sign } from "jsonwebtoken"

export const checkApi = async (
    mockMethod: jest.Mock,
    apiFunction,
    mockResolvedData,
    expectedArgs,
    responseArgs: any = [],
    calledTimes: number = 1
) => {
    mockMethod.mockResolvedValue({ data: mockResolvedData })
    const data = await apiFunction(...responseArgs)
    expect(data).toEqual(mockResolvedData)
    expect(mockMethod).toHaveBeenCalledTimes(calledTimes)
    expect(mockMethod).toHaveBeenCalledWith(...expectedArgs)
}

export const checkApiWithJwt = async (
    mockMethod: jest.Mock,
    apiFunction,
    mockResolvedData,
    expectedArgs,
    responseArgs: any = [],
    calledTimes: number = 1
) => {
    const mockToken = sign(mockResolvedData, 'test_secret_key')
    mockMethod.mockResolvedValue({ data: { token: mockToken } })
    const data = await apiFunction(...responseArgs)
    expect(data).toEqual(expect.objectContaining(mockResolvedData))
    expect(mockMethod).toHaveBeenCalledTimes(calledTimes)
    expect(mockMethod).toHaveBeenCalledWith(...expectedArgs)
}
/* eslint-enable @typescript-eslint/no-explicit-any */