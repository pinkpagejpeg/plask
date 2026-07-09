import { FC } from "react"
import { getWeekRange } from "@/shared/lib"
import classes from "./StatisticsSwitcher.module.scss"

interface IWeekParams {
    from: string,
    to: string,
}

interface StatisticsSwitcherProps {
    text: string,
    onSwitch: React.Dispatch<React.SetStateAction<IWeekParams>>
}

export const StatisticsSwitcher: FC<StatisticsSwitcherProps> = ({ text, onSwitch }) => {
    const switchNextWeek = () => {
        const currentWeekMonday = new Date(text.split(' - ')[0])
        currentWeekMonday.setDate(currentWeekMonday.getDate() + 7)
        onSwitch(getWeekRange(currentWeekMonday))
    }

    const switchPrevWeek = () => {
        const currentWeekMonday = new Date(text.split(' - ')[0])
        currentWeekMonday.setDate(currentWeekMonday.getDate() - 7)
        onSwitch(getWeekRange(currentWeekMonday))
    }
    return (
        <div className={classes.statistics__switcher}>
            <button className={classes.statistics__switcher_button} onClick={switchPrevWeek}>
                <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.728098 4.87907C-0.241809 5.67904 -0.241809 7.16492 0.728098 7.96489L6.08485 12.3831C7.38933 13.459 9.35742 12.5311 9.35742 10.8402L9.35742 2.00381C9.35742 0.312872 7.38933 -0.615021 6.08485 0.460896L0.728098 4.87907Z" fill="currentColor" />
                </svg>

            </button>

            <p className={classes.main_text}>{text}</p>

            <button className={classes.statistics__switcher_button} onClick={switchNextWeek}>
                <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.62932 7.96489C9.59923 7.16493 9.59923 5.67904 8.62932 4.87907L3.27257 0.460898C1.96809 -0.61502 1.92099e-07 0.312869 1.71935e-07 2.00381L6.65626e-08 10.8402C4.63984e-08 12.5311 1.96809 13.459 3.27257 12.3831L8.62932 7.96489Z" fill="currentColor" />
                </svg>
            </button>
        </div>
    );
}
