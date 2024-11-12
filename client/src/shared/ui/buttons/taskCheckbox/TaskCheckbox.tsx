import { useState, FC } from 'react'
import classes from './TaskCheckbox.module.scss'
import { deleteTask, updateTask, updateTaskStatus } from '../../../api'
import { deleteIcon } from '../../../assets'
import { ITaskCheckbox } from './types'
import { useAppDispatch, useTypedSelector } from '../../../../features/hooks'
import { destroyTask } from '../../../../entities/tasks'

export const TaskCheckbox: FC<ITaskCheckbox> = ({ label, checked, taskId, allowEdit }) => {
    // const { task } = useContext(Context)
    const { tasks } = useTypedSelector(state => state.task)
    const [isChecked, setIsChecked] = useState(checked)
    const [isEditing, setIsEditing] = useState(false)
    const [info, setInfo] = useState(label)
    const dispatch = useAppDispatch()

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
        changeStatus()
    }

    const handleSpanClick = () => {
        setIsEditing(true)
    }

    const handleInputBlur = () => {
        changeTask()
        setIsEditing(false)
    }

    const changeTask = async () => {
        try {
            if (allowEdit) {
                let data

                if (info === '') {
                    deleteTask()
                }

                data = await updateTask(taskId, info)
                // task.editTask(data.task.id, data.task)
                // dispatch
            }
        } catch (e) {
            alert(`При изменении задачи возникла ошибка: ${e.response.data.message}`)
        }
    }

    const changeStatus = async () => {
        try {
            if (allowEdit) {
                let data

                data = await updateTaskStatus(taskId, !isChecked)
                // task.editTask(data.task.id, data.task)
                // dispatch
            }
        } catch (e) {
            alert(`При изменении статуса задачи возникла ошибка: ${e.response.data.message}`)
        }
    }

    const deleteTask = async () => {
        if (allowEdit) {
            dispatch(destroyTask(taskId))
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