import { useState, useContext, FC } from 'react'
// import { observer } from 'mobx-react-lite'
// import { Context } from '../../../../main'
import classes from './GoalCheckbox.module.scss'
import { deleteGoalItem, updateGoalItem, updateGoalItemStatus } from '../../../api'
import {deleteIcon} from '../../../assets'
import { IGoalCheckbox } from './types'

export const GoalCheckbox: FC<IGoalCheckbox> = ({ label, checked, goalItemId, updateProgress }) => {
    // // const { goalItem } = useContext(Context)
    // const [isChecked, setIsChecked] = useState(сhecked)
    // const [isEditing, setIsEditing] = useState(false)
    // const [info, setInfo] = useState(label)

    // const handleCheckboxChange = () => {
    //     setIsChecked(!isChecked)
    //     changeStatus()
    // };

    // const handleSpanClick = () => {
    //     setIsEditing(true)
    // };

    // const handleInputBlur = () => {
    //     changeGoalItem()
    //     setIsEditing(false)
    // };

    // const changeGoalItem = async () => {
    //     try {
    //         let data

    //         if (info === '') {
    //             destroyGoalItem()
    //         }

    //         data = await updateGoalItem(goalItemId, info)
    //         goalItem.editGoalItem(data.goal_item.id, data.goal_item)
    //     } catch (e) {
    //         alert(e.response.data.message)
    //     }
    // }

    // const changeStatus = async () => {
    //     try {
    //         let data

    //         data = await updateGoalItemStatus(goalItemId, !isChecked)
    //         goalItem.editGoalItem(data.goal_item.id, data.goal_item)
    //         updateProgress()
    //     } catch (e) {
    //         alert(e.response.data.message)
    //     }
    // }

    // const destroyGoalItem = async () => {
    //     try {
    //         let data

    //         data = await deleteGoalItem(goalItemId)
    //         goalItem.removeGoalItem(data.deletedGoalItemId)
    //         updateProgress()
    //     }
    //     catch (e) {
    //         alert(e.response.data.message)
    //     }
    // }

    return (
        <div className={classes.checkbox__wrapper}>
            {/* <label>
                <input
                    type="checkbox"
                    className={classes.checkbox__input}
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                <span className={classes.checkbox__label}></span>
            </label>
            {isEditing ? (
                <input
                    type="text"
                    className={classes.input}
                    value={info}
                    onChange={e => setInfo(e.target.value)}
                    onBlur={handleInputBlur}
                    autoFocus
                    required
                />
            ) : (
                <span
                    className={`${classes.checkbox__goal} ${isChecked ? classes.checked : ''}`}
                    onClick={handleSpanClick}>
                    {info}
                </span>
            )}
            <button className={classes.checkbox__button_delete} onClick={destroyGoalItem}>
                <img src={deleteIcon} alt='Иконка для удаления задачи' />
            </button> */}
        </div>
    )
}