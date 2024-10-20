import { FC, useContext, useEffect, useState } from 'react'
// import { observer } from 'mobx-react-lite'
// import { Context } from '../main'
import classes from './Tasks.module.scss'
import { Navbar, TaskCheckbox } from '../../../shared/ui'
import { createTask, getTask } from '../../../shared/api'

export const Tasks: FC = () => {
    // const { task, user } = useContext(Context)
    const [info, setInfo] = useState('')

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    // useEffect(() => {
    //     const fetchTasks = async () => {
    //         try {
    //             if (user._user.id) {
    //                 const tasks = await getTask(user._user.id);
    //                 task.setTask(tasks);
    //             }
    //         } catch (e) {
    //             alert('Ошибка при получении задач:', e.response.data.message);
    //         }
    //     };

    //     fetchTasks();
    // }, [task, user])

    // const addTask = async (e) => {
    //     e.preventDefault()
    //     try {
    //         let data

    //         data = await createTask(user._user.id, info)

    //         task.addTaskList(data)
    //         setInfo('')
    //     }
    //     catch (e) {
    //         alert(e.response.data.message)
    //     }
    // }

    return (
        <>
            <Navbar />
            {/* <div className={classes.container}>
                <div className={classes.task__wrapper}>
                    <h3 className={classes.title}>Задачи</h3>
                    <div className={classes.task__listbox}>
                        {task._task && task._task.length > 0 ? (
                            <div className={classes.task__list}>
                                {task._task.map((taskItem) => (
                                    <TaskCheckBox key={taskItem.id} label={taskItem.info} сhecked={taskItem.status} taskId={taskItem.id} allowEdit={true} />
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
                        <input className={classes.button_light}
                            type="submit" value="Добавить задачу"
                            onClick={addTask} />
                    </form>
                </div>
            </div> */}
        </>
    )
}