import { FC } from "react"
import classes from "./Achieve.module.scss"
import { wordHelper } from "@/shared/lib"

interface AchieveProps {
    daysBest: number
    tasksDone: number
    daysActive: number
}

export const Achieve: FC<AchieveProps> = ({
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
