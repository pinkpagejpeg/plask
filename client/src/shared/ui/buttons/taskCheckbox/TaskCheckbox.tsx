import { useState, FC } from 'react'
import classes from './TaskCheckbox.module.scss'
import { deleteIcon } from '../../../assets'
import { ITaskCheckbox } from './types'

export const TaskCheckbox: FC<ITaskCheckbox> = ({ label, checked, taskId, allowEdit, updateTask, updateTaskStatus, deleteTask }) => {
    const [isChecked, setIsChecked] = useState(checked)
    const [isEditing, setIsEditing] = useState(false)
    const [info, setInfo] = useState(label)

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
        updateTaskStatusHandler()
    }

    const handleSpanClick = () => {
        setIsEditing(true)
    }

    const handleInputBlur = () => {
        updateTaskHandler()
        setIsEditing(false)
    }

    const taskInfoChangeHandler = (event) => {
        setInfo(event.target.value)
    }

    const updateTaskHandler = () => {
        try {
            if (allowEdit) {
                if (info === '') {
                    deleteTaskHandler()
                }
                updateTask(taskId, info)
            }
        } catch (error) {
            alert(`При изменении задачи возникла ошибка: ${error.response.data}`)
        }
    }

    const updateTaskStatusHandler = () => {
        try {
            if (allowEdit) {
                updateTaskStatus(taskId, !isChecked)
            }
        } catch (error) {
            alert(`При изменении статуса задачи возникла ошибка: ${error.response.data}`)
        }
    }

    const deleteTaskHandler = () => {
        try {
            if (allowEdit) {
                deleteTask(taskId)
            }
        } catch (error) {
            alert(`При удвлении задачи возникла ошибка: ${error.response.data}`)
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
            {allowEdit && isEditing ? (
                <input
                    type="text"
                    className={classes.input}
                    value={info}
                    onChange={taskInfoChangeHandler}
                    onBlur={handleInputBlur}
                    autoFocus
                    required
                />
            ) : (
                <span
                    className={`${classes.checkbox__task} ${isChecked ? classes.checked : ''}`}
                    onClick={handleSpanClick}>
                    {info}
                </span>
            )}
            <button className={classes.checkbox__button_delete} onClick={deleteTaskHandler}>
                <img src={deleteIcon} alt='Иконка для удаления задачи' />
            </button>
        </div>
    )
}