import { FC, SetStateAction, useEffect, useState } from 'react'
import classes from './Tasks.module.scss'
import { Navbar, TaskCheckbox } from '../../../shared/ui'
import { useAppDispatch, useTypedSelector } from 'shared/store'
import { fetchTasksByUserId, addTask, changeTask, changeTaskStatus, destroyTask } from '../../../entities/tasks'

export const Tasks: FC = () => {
    const dispatch = useAppDispatch()
    const { user } = useTypedSelector(state => state.user)
    const { tasks } = useTypedSelector(state => state.task)
    const [info, setInfo] = useState('')

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />
    // }

    useEffect(() => {
        if (user) {
            dispatch(fetchTasksByUserId(user?.id))
        }
    }, [dispatch, user])
    console.log(tasks)
    const createTask = async (event: { preventDefault: () => void }) => {
        event.preventDefault()
        if (user && info) {
            dispatch(addTask({ userId: user?.id, info }))
            setInfo('')
        }
    }

    const updateTask = (taskId: number, info: string) => {
        if (taskId && info) {
            dispatch(changeTask({ taskId, info }))
        }
    }

    const updateTaskStatus = (taskId: number, status: boolean) => {
        if (taskId) {
            dispatch(changeTaskStatus({ taskId, status }))
        }
    }

    const deleteTask = (taskId: number) => {
        if (taskId) {
            dispatch(destroyTask(taskId))
        }
    }

    const taskInfoChangeHandler = (event: { target: { value: SetStateAction<string> } }) => {
        setInfo(event.target.value)
    }

    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.task__wrapper}>
                    <h3 className={classes.title}>Задачи</h3>
                    <div className={classes.task__listbox}>
                        {tasks && tasks.length > 0 ? (
                            <div className={classes.task__list}>
                                {tasks.map((taskItem) => (
                                    <TaskCheckbox
                                        key={taskItem.id}
                                        label={taskItem.info}
                                        checked={taskItem.status}
                                        taskId={taskItem.id}
                                        allowEdit={true}
                                        updateTask={updateTask}
                                        updateTaskStatus={updateTaskStatus}
                                        deleteTask={deleteTask}
                                    />
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
                            onChange={taskInfoChangeHandler}
                            required />
                        <input className={classes.button_light}
                            type="submit" value="Добавить задачу"
                            onClick={createTask} />
                    </form>
                </div>
            </div>
        </>
    )
}