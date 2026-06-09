export const wordHelper = (key: string, num: number) => {
    const words = {
        daysBest: ["Лучший день", "Лучших дня", "Лучших дней"],
        tasksDone: ["Задача выполнена", "Задачи выполнены", "Задач выполнено"],
        daysActive: ["Активный день", "Активных дня", "Активных дней"]
    }

    const n = Math.abs(num)
    const idx = (n % 10 === 1 && n % 100 !== 11) ? 0
        : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 1
            : 2

    return words[key as keyof typeof words]?.[idx] || ""
}