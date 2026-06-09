import { FC } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import { StatisticsTooltip } from "./tooltip/StatisticsTooltip"
import { StatisticsAchieve } from "./achieve/StatisticsAchieve"
import { StatisticsSwitcher } from "./switcher/StatisticsSwitcher"
import { PageLayout } from "@/shared/ui"
import classes from "./Statistics.module.scss"

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

        const tickCount = Math.ceil(maxValue / step)
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

                <StatisticsSwitcher text={`${weeklyData[0].date} - ${weeklyData[6].date}`}/>

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

                <StatisticsAchieve  tasksDone={16} daysBest={2} daysActive={7} />
            </div>
        </PageLayout>
    )
}