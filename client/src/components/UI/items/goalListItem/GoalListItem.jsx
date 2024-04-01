import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../../../../main'
import classes from './GoalListItem.module.scss'
import { deleteGoal, updateGoal } from '../../../../http/goalApi'
import delete_icon from '../../../../assets/images/delete_icon.png'

const GoalListItem = observer(({ title, goalId }) => {
    const { goal } = useContext(Context)
    const [isEditing, setIsEditing] = useState(false)
    const [info, setInfo] = useState(title)
    const [prevInfo, setPrevInfo] = useState(title)

    // прогресс равен количеству выполненных задач / общее количество задач * 100
    let progress = 50

    const handleSpanClick = () => {
        setIsEditing(true)
    };

    const handleInputBlur = () => {
        if (prevInfo !== info && info.trim() !== '') {
            changeGoal()
        } else {
            setInfo(prevInfo)
        }
        setIsEditing(false)
    };

    const changeGoal = async () => {
        try {
            let data

            data = await updateGoal(goalId, info)
            goal.editGoal(data.goal.id, data.goal)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    // const changeStatus = async () => {
    //     try {
    //         if (allowEdit) {
    //             let data

    //             data = await updateTaskStatus(taskId, !isChecked)
    //             console.log(data.task.id, data.task)
    //             task.editTask(data.task.id, data.task)
    //         }
    //     } catch (e) {
    //         alert(e.response.data.message)
    //     }
    // }

    const destroyGoal = async () => {
        try {
            let data

            data = await deleteGoal(goalId)
            goal.removeGoal(data.deletedGoalId)
        }
        catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <div className={classes.goal__wrapper}>
            <div className={classes.goal__topline}>
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
                    <h4 className={classes.title} onClick={handleSpanClick}>{title}</h4>
                )}
                <button className={classes.goal__button_delete} onClick={destroyGoal}>
                    <img src={delete_icon} alt='Иконка для удаления задачи' />
                </button>
            </div>
            <div className={classes.goal__progress}>
                <progress className={classes.goal__progressbar} id="progressbar" value={progress} max="100">{progress}%</progress>
                <label className={classes.title} htmlFor="progressbar">{progress}%</label>
            </div>
        </div>
    );
})

export default GoalListItem;