import { FC } from "react"
import classes from "./StatisticsTooltip.module.scss"

interface StatisticsTooltipProps {
    active?: boolean
    payload?: any[]
    label?: string
}

export const StatisticsTooltip: FC<StatisticsTooltipProps> = ({
    active,
    payload,
    label
}) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className={classes.statistics__wrapper}>
                <p className={classes.main_text}>{label} {data.date}</p>
                <p className={classes.main_text}>{payload[0].value} выполненных задач</p>
            </div>
        );
    }
    return null
}
