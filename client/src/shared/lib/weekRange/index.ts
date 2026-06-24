export const getWeekRange = (date: Date) => {
    const dayOfWeek = date.getDay()
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    const monday = new Date(date)
    monday.setDate(date.getDate() - diffToMonday)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const formatDate = (date: Date) => date.toISOString().split('T')[0]

    return {
        from: formatDate(monday),
        to: formatDate(sunday)
    }
}