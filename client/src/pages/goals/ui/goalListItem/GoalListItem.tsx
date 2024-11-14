import { useState, FC } from 'react'
import classes from './GoalListItem.module.scss'
import { deleteGoal } from '../../../../shared/api'
import { deleteIcon } from '../../../../shared/assets'
import { NavLink } from 'react-router-dom'
import { GOALS_ITEM_ROUTE } from '../../../../shared/config'
import { IGoalListItem } from './types'
import { useTypedSelector } from '../../../../features/hooks'

export const GoalListItem: FC<IGoalListItem> = ({ title, goalId, progress }) => {
    const { goals } = useTypedSelector(state => state.goal)

    const destroyGoal = async () => {
        try {
            let data

            data = await deleteGoal(goalId)
            // goals.removeGoal(data.deletedGoalId)
        }
        catch (e) {
            alert(e.response.data.message);
        }
    }

    return (
        <div className={classes.goal__wrapper}>
            <div className={classes.goal__topline}>
                <NavLink to={GOALS_ITEM_ROUTE + '/' + goalId}>
                    <h4 className={classes.title}>{title}</h4>
                </NavLink>
                <button className={classes.goal__button_delete} onClick={destroyGoal}>
                    <img src={deleteIcon} alt='Иконка для удаления задачи' />
                </button>
            </div>
            <div className={classes.goal__progress}>
                <progress className={classes.goal__progressbar} id="progressbar" value={progress} max="100">{progress}%</progress>
                <label className={classes.title} htmlFor="progressbar">{progress}%</label>
            </div>
        </div>
    )
}