import { useState, FC } from 'react'
import classes from './TaskCheckbox.module.scss'
import { deleteIcon } from '../../../assets'
import { ITaskCheckbox } from './types'
import { useAppDispatch } from '../../../../features/hooks'
import { destroyTask, changeTask, changeTaskStatus } from '../../../../entities/tasks'

export const TaskCheckbox: FC<ITaskCheckbox> = ({ label, checked, taskId, allowEdit }) => {
    const [isChecked, setIsChecked] = useState(checked)
    const [isEditing, setIsEditing] = useState(false)
    const [info, setInfo] = useState(label)
    const dispatch = useAppDispatch()

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
        updateTaskStatus()
    }

    const handleSpanClick = () => {
        setIsEditing(true)
    }

    const handleInputBlur = () => {
        updateTask()
        setIsEditing(false)
    }

    const updateTask = async () => {
        if (allowEdit) {
            if (info === '') {
                deleteTask()
            }
            if (taskId && info) {
                dispatch(changeTask({ taskId: taskId, info: info }))
            }
        }
    }

    const updateTaskStatus = async () => {
        if (allowEdit) {
            if (taskId) {
                dispatch(changeTaskStatus({ taskId: taskId, status: !isChecked }))
            }
        }
    }

    const deleteTask = async () => {
        if (allowEdit) {
            if (taskId) {
                dispatch(destroyTask(taskId))
            }
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
                    onChange={e => setInfo(e.target.value)}
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
            <button className={classes.checkbox__button_delete} onClick={deleteTask}>
                <img src={deleteIcon} alt='Иконка для удаления задачи' />
            </button>
        </div>
    )
}