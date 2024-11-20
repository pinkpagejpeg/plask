import { useState, FC } from 'react'
import classes from './GoalCheckbox.module.scss'
import { deleteGoalItem, updateGoalItem, updateGoalItemStatus } from '../../../api'
import { deleteIcon } from '../../../assets'
import { IGoalCheckbox } from './types'

export const GoalCheckbox: FC<IGoalCheckbox> = ({ label, checked, goalItemId, updateProgress }) => {
    const [isChecked, setIsChecked] = useState(checked)
    const [isEditing, setIsEditing] = useState(false)
    const [info, setInfo] = useState(label)

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
        changeStatus()
    }

    const handleSpanClick = () => {
        setIsEditing(true)
    }

    const handleInputBlur = () => {
        changeGoalItem()
        setIsEditing(false)
    }

    const changeGoalItem = async () => {
        try {
            if (info === '') {
                destroyGoalItem()
                updateProgress()
            }

            if (info && goalItemId) {
                await updateGoalItem(goalItemId, info)
                updateProgress()
            }
        } catch (e) {
            alert(`При изменении подцели возникла ошибка: ${e.response.data.message}`)
        }
    }

    const changeStatus = async () => {
        try {
            if (goalItemId) {
                await updateGoalItemStatus(goalItemId, !isChecked)
                updateProgress()
            }
        } catch (e) {
            alert(`При изменении статуса подцели возникла ошибка: ${e.response.data.message}`)
        }
    }

    const destroyGoalItem = async () => {
        try {
            if (goalItemId) {
                await deleteGoalItem(goalItemId)
                updateProgress()
            }
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