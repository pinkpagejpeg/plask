import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../../../../main'
import classes from './TaskCheckbox.module.scss'
import { deleteTask } from '../../../../http/taskApi'
import delete_icon from '../../../../assets/images/delete_icon.png'

const TaskCheckBox = observer (({ label, сhecked, taskId }) => {
    const { task } = useContext(Context)
    const [isChecked, setIsChecked] = useState(сhecked);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const destroyTask = async () => {

        try {
            let data

            data = await deleteTask(taskId)
            task.removeTask(data.deletedTaskId)
            alert('Задача успешно удалена')
        }
        catch (e) {
            alert(e.response.data.message)
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
                <span className={classes.checkbox__label + (isChecked ? ' ' + classes.checked : '')}>{label}</span>
                <button className={classes.checkbox__button_delete} onClick={destroyTask}>
                    <img src={delete_icon} alt='Иконка для удаления задачи' />
                </button>
            </label>
        </div>
    );
})

export default TaskCheckBox;