import { FC } from "react"
import { TooltipProps } from "recharts"
import classes from "./CustomTooltip.module.scss"
import { wordHelper } from "@/shared/lib"

interface ChartData {
    day: string
    date: string
    tasks: number
}

interface CustomTooltipPayload {
    dataKey: string
    name: string
    value: number
    payload: ChartData
    color?: string
    stroke?: string
    fill?: string
}

interface CustomTooltipProps extends TooltipProps<number, string> {
    active?: boolean
    payload?: CustomTooltipPayload[]
    label?: string
}

export const CustomTooltip: FC<CustomTooltipProps> = ({
    active,
    payload,
    label
}) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className={classes.statistics__wrapper}>
                <p className={classes.main_text}>{label} {data.date}</p>
                <p className={classes.main_text}>
                    {payload[0].value} {wordHelper("tasksDone", payload[0].value).toLowerCase()}</p>
            </div>
        );
    }
    return null
}
