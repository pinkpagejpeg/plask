import { FC } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import { PageLayout } from "@/shared/ui"
import classes from "./Statistics.module.scss"
import { StatisticsTooltip } from "./statisticsTooltip/StatisticsTooltip"

const tickStyles = {
    fill: '#E6E6E6',
    fontFamily: 'Ubuntu, sans-serif',
    fontSize: '14px',
    fontWeight: 300,
    letterSpacing: '5%'
}

const weeklyData = [
    { day: 'Пн', date: '23.03', tasks: 2 },
    { day: 'Вт', date: '24.03', tasks: 12 },
    { day: 'Ср', date: '25.03', tasks: 5 },
    { day: 'Чт', date: '26.03', tasks: 21 },
    { day: 'Пт', date: '27.03', tasks: 11 },
    { day: 'Сб', date: '28.03', tasks: 8 },
    { day: 'Вс', date: '29.03', tasks: 15 },
]

const achieveData = {
    tasksDone: 16,
    daysBest: 2,
    daysActive: 7
}

export const Statistics: FC = () => {
    const calculateYAxisTicks = (values: number[]) => {
        const maxValue = Math.max(...values)

        const countTicks = 5
        const range = maxValue
        const desiredStep = range / countTicks

        const possibleSteps = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100]

        let step = possibleSteps[0]
        for (const s of possibleSteps) {
            if (s >= desiredStep) {
                step = s
                break
            }
        }

        let tickCount = Math.ceil(maxValue / step)
        if (tickCount > countTicks) {
            for (const s of possibleSteps) {
                if (s > step && Math.ceil(maxValue / s) <= countTicks) {
                    step = s
                    break
                }
            }
        }

        const domainMax = Math.ceil(maxValue / step) * step
        const ticks = []

        for (let i = step; i <= domainMax; i += step) {
            ticks.push(i)
        }

        return { ticks, domainMax, step }
    }

    const tasks = weeklyData.map(el => el.tasks)
    const { ticks, domainMax, step } = calculateYAxisTicks(tasks)

    return (
        <PageLayout title="Статистика по задачам">
            <div className={classes.statistics__wrapper}>
                <h4 className={classes.title}>Статистика за неделю</h4>

                <div className={classes.statistics__switcher}>
                    <button className={classes.statistics__switcher_button}>
                        <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.728098 4.87907C-0.241809 5.67904 -0.241809 7.16492 0.728098 7.96489L6.08485 12.3831C7.38933 13.459 9.35742 12.5311 9.35742 10.8402L9.35742 2.00381C9.35742 0.312872 7.38933 -0.615021 6.08485 0.460896L0.728098 4.87907Z" fill="currentColor" />
                        </svg>

                    </button>
                    <p className={classes.main_text}>{weeklyData[0].date} - {weeklyData[6].date}</p>
                    <button className={classes.statistics__switcher_button}>
                        <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.62932 7.96489C9.59923 7.16493 9.59923 5.67904 8.62932 4.87907L3.27257 0.460898C1.96809 -0.61502 1.92099e-07 0.312869 1.71935e-07 2.00381L6.65626e-08 10.8402C4.63984e-08 12.5311 1.96809 13.459 3.27257 12.3831L8.62932 7.96489Z" fill="currentColor" />
                        </svg>

                    </button>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                        <XAxis
                            dataKey="day"
                            axisLine={{ stroke: '#6D6D6D' }}
                            tickLine={{ stroke: '' }}
                            tick={tickStyles}
                            tickCount={5}
                            padding={{ left: 80, right: 80 }}
                        />
                        <YAxis
                            domain={[step, domainMax]}
                            axisLine={{ stroke: '#6D6D6D' }}
                            tickLine={{ stroke: '' }}
                            tick={tickStyles}
                            ticks={ticks}
                            padding={{ top: 20, bottom: 10 }}
                        />
                        <Tooltip content={<StatisticsTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="tasks"
                            stroke="#E6E6E6"
                            strokeWidth={3}
                            dot={{ fill: '#E6E6E6', strokeWidth: 2, r: 2 }}
                            activeDot={{ r: 4, fill: '#E6E6E6' }}
                        />
                    </LineChart>
                </ResponsiveContainer>

                <div className={classes.statistics__achieve}>
                    <div className={classes.statistics__achieve_item}>
                        <span className={classes.title}>{achieveData.daysBest}</span>
                        <span className={classes.main_text}>Лучший день</span>
                    </div>

                    <div className={classes.statistics__achieve_divider}></div>

                    <div className={classes.statistics__achieve_item}>
                        <span className={classes.title}>{achieveData.tasksDone}</span>
                        <span className={classes.main_text}>Задач выполнено</span>
                    </div>

                    <div className={classes.statistics__achieve_divider}></div>

                    <div className={classes.statistics__achieve_item}>
                        <span className={classes.title}>{achieveData.daysActive}</span>
                        <span className={classes.main_text}>Активных дней</span>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}