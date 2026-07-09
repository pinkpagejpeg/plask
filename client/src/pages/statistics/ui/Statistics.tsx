import { FC, useEffect, useState } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import { StatisticsTooltip } from "./tooltip/StatisticsTooltip"
import { StatisticsAchieve } from "./achieve/StatisticsAchieve"
import { StatisticsSwitcher } from "./switcher/StatisticsSwitcher"
import { PageLayout } from "@/shared/ui"
import { getWeekStatistics } from "@/shared/api"
import { calculateYAxisTicks, getWeekRange } from "@/shared/lib"
import classes from "./Statistics.module.scss"

interface IDayData {
    date: string,
    day: string,
    count: number
}

interface IWeekParams {
    from: string,
    to: string,
}

const tickStyles = {
    fill: '#E6E6E6',
    fontFamily: 'Ubuntu, sans-serif',
    fontSize: '14px',
    fontWeight: 300,
    letterSpacing: '5%'
}

export const Statistics: FC = () => {
    const [weeklyData, setWeeklyData] = useState<IDayData[]>([])
    const [weekParams, setWeekParams] = useState<IWeekParams>(() => getWeekRange(new Date()))
    const [tasksDone, setTasksDone] = useState(0)
    const [daysBest, setDaysBest] = useState(0)
    const [daysActive, setDaysActive] = useState(0)

    useEffect(() => {
        const fetchWeekStatistic = async () => {
            try {
                const { weeklyData, tasksDone, daysBest, daysActive } = await getWeekStatistics(weekParams.from, weekParams.to)
                setWeeklyData(weeklyData)
                setTasksDone(tasksDone)
                setDaysBest(daysBest)
                setDaysActive(daysActive)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    alert(`При получении недельной статистики возникла ошибка: ${error.message}`)
                } else {
                    alert("При получении недельной статистики возникла неизвестная ошибка")
                }
            }
        }

        fetchWeekStatistic()
    }, [weekParams.from, weekParams.to])


    const tasks = weeklyData.map(el => el.count)
    const { ticks, domainMax, step } = calculateYAxisTicks(tasks)
    const hasData = weeklyData.some(item => item.count > 0)

    return (
        <PageLayout title="Статистика по задачам">
            <div className={classes.statistics__wrapper}>
                <h4 className={classes.title}>Статистика за неделю</h4>

                <StatisticsSwitcher text={`${weekParams.from} - ${weekParams.to}`} onSwitch={setWeekParams} />
                {!hasData &&
                    <div className={classes.statistics__emptyData}>
                        <p className={classes.title}>Нет выполненных задач за эту неделю</p>
                    </div>
                }

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
                        {hasData &&
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#E6E6E6"
                                strokeWidth={3}
                                dot={{ fill: '#E6E6E6', strokeWidth: 2, r: 2 }}
                                activeDot={{ r: 4, fill: '#E6E6E6' }}
                            />
                        }
                    </LineChart>
                </ResponsiveContainer>

                <StatisticsAchieve tasksDone={tasksDone} daysBest={daysBest} daysActive={daysActive} />
            </div>
        </PageLayout>
    )
}