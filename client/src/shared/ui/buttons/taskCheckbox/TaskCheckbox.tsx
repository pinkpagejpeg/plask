import { useState, useContext, FC } from 'react'
// import { observer } from 'mobx-react-lite'
// import { Context } from '../../../../main'
import classes from './TaskCheckbox.module.scss'
import { deleteTask, updateTask, updateTaskStatus } from '../../../api'
import { deleteIcon } from '../../../assets'

export const TaskCheckbox: FC = ({ label, checked, taskId, allowEdit }) => {
    // const { task } = useContext(Context)
    // const [isChecked, setIsChecked] = useState(checked)
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
    //     changeTask()
    //     setIsEditing(false)
    // };

    // const changeTask = async () => {
    //     try {
    //         if (allowEdit) {
    //             let data

    //             if (info === '') {
    //                 destroyTask()
    //             }

    //             data = await updateTask(taskId, info)
    //             task.editTask(data.task.id, data.task)
    //         }
    //     } catch (e) {
    //         alert(e.response.data.message)
    //     }
    // }

    // const changeStatus = async () => {
    //     try {
    //         if (allowEdit) {
    //             let data

    //             data = await updateTaskStatus(taskId, !isChecked)
    //             task.editTask(data.task.id, data.task)
    //         }
    //     } catch (e) {
    //         alert(e.response.data.message)
    //     }
    // }

    // const destroyTask = async () => {
    //     try {
    //         if (allowEdit) {
    //             let data

    //             data = await deleteTask(taskId)
    //             task.removeTask(data.deletedTaskId)
    //         }
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
            <button className={classes.checkbox__button_delete} onClick={destroyTask}>
                <img src={deleteIcon} alt='Иконка для удаления задачи' />
            </button> */}
        </div>
    )
}