import { FC } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import { Switcher } from "../switcher/Switcher"
import { Achieve } from "../achieve/Achieve"
import { CustomTooltip } from "../tooltip/CustomTooltip"
import { calculateYAxisTicks } from "@/shared/lib"
import { IDayData, IWeekParams } from "../../model/types"
import classes from "./Week.module.scss"

interface IWeekProps {
    weeklyData: IDayData[],
    weekParams: IWeekParams,
    onSwitchWeekParams: React.Dispatch<React.SetStateAction<IWeekParams>>,
    tasksDone: number,
    daysBest: number,
    daysActive: number
}

const tickStyles = {
    fill: '#E6E6E6',
    fontFamily: 'Ubuntu, sans-serif',
    fontSize: '14px',
    fontWeight: 300,
    letterSpacing: '5%'
}

export const Week: FC<IWeekProps> = ({
    weekParams,
    onSwitchWeekParams,
    weeklyData,
    tasksDone,
    daysBest,
    daysActive
}) => {
    const tasks = weeklyData.map(el => el.count)
    const { ticks, domainMax, step } = calculateYAxisTicks(tasks)
    const hasData = weeklyData.some(item => item.count > 0)

    return (
        <div className={classes.statistics__wrapper}>
            <h4 className={classes.title}>Статистика за неделю</h4>

            <Switcher text={`${weekParams.from} - ${weekParams.to}`} onSwitch={onSwitchWeekParams} />
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
                    <Tooltip content={<CustomTooltip />} />
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

            <Achieve tasksDone={tasksDone} daysBest={daysBest} daysActive={daysActive} />
        </div>
    );
}
