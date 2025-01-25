import { useState, FC } from 'react'
import classes from './GoalCheckbox.module.scss'
import { deleteIcon } from '../../../assets'
import { IGoalCheckbox } from './types'

export const GoalCheckbox: FC<IGoalCheckbox> = ({ label, checked, goalItemId, changeSubgoal, changeSubgoalStatus, destroySubgoal }) => {
    const [isChecked, setIsChecked] = useState(checked)
    const [isEditing, setIsEditing] = useState(false)
    const [info, setInfo] = useState(label)

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
        changeSubgoalStatusHandler()
    }

    const handleSpanClick = () => {
        setIsEditing(true)
    }

    const handleInputBlur = () => {
        changeSubgoalHandler()
        setIsEditing(false)
    }

    const subgoalInfoChangeHandler = (event) => {
        setInfo(event.target.value)
    }

    const changeSubgoalHandler = async () => {
        try {
            if (info === '') {
                destroySubgoalHandler()
            }

            changeSubgoal(goalItemId, info)
        } catch (error) {
            alert(`При изменении подцели возникла ошибка: ${error.response.data}`)
        }
    }

    const changeSubgoalStatusHandler = async () => {
        try {
            changeSubgoalStatus(goalItemId, !isChecked)
        } catch (error) {
            alert(`При изменении статуса подцели возникла ошибка: ${error.response.data}`)
        }
    }

    const destroySubgoalHandler = async () => {
        try {
            destroySubgoal(goalItemId)
        }
        catch (error) {
            alert(`При удалении подцели возникла ошибка: ${error.response.data}`)
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
                    onChange={subgoalInfoChangeHandler}
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
            <button className={classes.checkbox__button_delete} onClick={destroySubgoalHandler}>
                <img src={deleteIcon} alt='Иконка для удаления задачи' />
            </button>
        </div>
    )
}