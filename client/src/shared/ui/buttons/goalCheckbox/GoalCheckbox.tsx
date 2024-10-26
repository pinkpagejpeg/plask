import { useState, useContext, FC } from 'react'
// import { observer } from 'mobx-react-lite'
// import { Context } from '../../../../main'
import classes from './GoalCheckbox.module.scss'
import { deleteGoalItem, updateGoalItem, updateGoalItemStatus } from '../../../api'
<<<<<<< HEAD
import { deleteIcon } from '../../../assets'
import { IGoalCheckbox } from './types'
import { useTypedSelector } from '../../../../features/hooks'

export const GoalCheckbox: FC<IGoalCheckbox> = ({ label, checked, goalItemId, updateProgress }) => {
    // const { goalItem } = useContext(Context)
    const { goals } = useTypedSelector(state => state.goal)
    const [isChecked, setIsChecked] = useState(checked)
    const [isEditing, setIsEditing] = useState(false)
    const [info, setInfo] = useState(label)
=======
import {deleteIcon} from '../../../assets'
import { IGoalCheckbox } from './types'

export const GoalCheckbox: FC<IGoalCheckbox> = ({ label, checked, goalItemId, updateProgress }) => {
    // // const { goalItem } = useContext(Context)
    // const [isChecked, setIsChecked] = useState(сhecked)
    // const [isEditing, setIsEditing] = useState(false)
    // const [info, setInfo] = useState(label)
>>>>>>> 9f76c12c39df5042070ca9d1fe95868534b138a6

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
        changeStatus()
    };

    const handleSpanClick = () => {
        setIsEditing(true)
    };

    const handleInputBlur = () => {
        changeGoalItem()
        setIsEditing(false)
    };

    const changeGoalItem = async () => {
        try {
            let data

            if (info === '') {
                destroyGoalItem()
            }

            data = await updateGoalItem(goalItemId, info)
            // goalItem.editGoalItem(data.goal_item.id, data.goal_item)
            // dispatch
        } catch (e) {
            alert(`При изменении подцели возникла ошибка: ${e.response.data.message}`)
        }
    }

    const changeStatus = async () => {
        try {
            let data

            data = await updateGoalItemStatus(goalItemId, !isChecked)
            // goalItem.editGoalItem(data.goal_item.id, data.goal_item)
            // dispatch
            updateProgress()
        } catch (e) {
            alert(`При изменении статуса подцели возникла ошибка: ${e.response.data.message}`)
        }
    }

    const destroyGoalItem = async () => {
        try {
            let data

            data = await deleteGoalItem(goalItemId)
            // goalItem.removeGoalItem(data.deletedGoalItemId)
            // dispatch
            updateProgress()
        }
        catch (e) {
            alert(`При удалении подцели возникла ошибка: ${e.response.data.message}`)
        }
    }

    return (
        <div className={classes.checkbox__wrapper}>
            <label>
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
            </button>
        </div>
    )
}