import { FC } from "react"
import { Week } from "./week/Week"
import { PageLayout } from "@/shared/ui"
import { useWeekStatistics } from "../model/useStatistics"
import classes from "./Statistics.module.scss"

export const Statistics: FC = () => {
     const { weeklyData, weekParams, setWeekParams, tasksDone, daysBest, daysActive } = useWeekStatistics()

    return (
        <PageLayout title="Статистика по задачам">
            <div className={classes.statistics__wrapper}>
                <Week
                    weeklyData={weeklyData}
                    weekParams={weekParams}
                    onSwitchWeekParams={setWeekParams}
                    tasksDone={tasksDone}
                    daysBest={daysBest}
                    daysActive={daysActive} />
            </div>
        </PageLayout>
    )
}