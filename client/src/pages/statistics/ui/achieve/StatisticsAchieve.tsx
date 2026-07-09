import { FC } from "react"
import classes from "./StatisticsAchieve.module.scss"
import { wordHelper } from "@/shared/lib"

interface StatisticsAchieveProps {
    daysBest: number
    tasksDone: number
    daysActive: number
}

export const StatisticsAchieve: FC<StatisticsAchieveProps> = ({
    daysBest,
    tasksDone,
    daysActive
}) => {
    return (
        <div className={classes.statistics__achieve}>
            <div className={classes.statistics__achieve_item}>
                <span className={classes.title}>{daysBest}</span>
                <span className={classes.main_text}>{wordHelper("daysBest", daysBest)}</span>
            </div>

            <div className={classes.statistics__achieve_divider}></div>

            <div className={classes.statistics__achieve_item}>
                <span className={classes.title}>{tasksDone}</span>
                <span className={classes.main_text}>{wordHelper("tasksDone", tasksDone)}</span>
            </div>

            <div className={classes.statistics__achieve_divider}></div>

            <div className={classes.statistics__achieve_item}>
                <span className={classes.title}>{daysActive}</span>
                <span className={classes.main_text}>{wordHelper("daysActive", daysActive)}</span>
            </div>
        </div>
    );
}
