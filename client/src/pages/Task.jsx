import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../main'
import classes from '../styles/Task.module.scss'
import NavBar from '../components/nav/NavBar'
import { createTask, getTask } from '../http/taskApi'
import TaskCheckBox from '../components/UI/buttons/taskCheckbox/TaskCheckbox'

const Task = observer(() => {
    const { task, user } = useContext(Context)
    const [info, setInfo] = useState('')

    if (!user) {
        return <Navigate to={LOGIN_ROUTE} />;
    }

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                if (user._user.id) {
                    const tasks = await getTask(user._user.id);
                    task.setTask(tasks);
                }
            } catch (e) {
                console.error('Ошибка при получении задач:', e);
            }
        };

        fetchTasks();
    }, [task, user])

    const addTask = async (e) => {
        e.preventDefault()
        try {
            let data
            // Не добавляется информация, создается запись со значением null
            data = await createTask(user._user.id, info)

            task.addTaskList(data)
        }
        catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <>
            <NavBar />
            <div className={classes.container}>
                <div className={classes.task__wrapper}>
                    <h3 className={classes.title}>Задачи</h3>
                    <div className={classes.task__listbox}>
                        {task._task && task._task.length > 0 ? (
                            <div className={classes.task__list}>
                                {task._task.map((taskItem) => (
                                    <TaskCheckBox key={taskItem.id} label={taskItem.info} />
                                ))}
                            </div>
                        ) : (
                            <h4 className={classes.title}>Задачи не обнаружены</h4>
                        )}
                    </div>
                    <form className={classes.task__form}>
                        <input className={classes.input}
                            type="text" placeholder="Название"
                            value={info}
                            onChange={e => setInfo(e.target.value)}
                            required />
                        <input type="submit" className={classes.button_light} value="Добавить задачу" onClick={addTask} />
                    </form>
                </div>
            </div>
        </>
    );
})

export default Task;