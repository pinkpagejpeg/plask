import { useState, useEffect, FC, useCallback, SetStateAction } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import classes from './Subgoals.module.scss'
import { Navbar, GoalCheckbox } from '../../../shared/ui'
import { getGoal, getGoalProgress, getGoalItems, createGoalItem, updateGoalItem, updateGoalItemStatus, deleteGoalItem } from '../../../shared/api'
import { addIcon, deleteIcon } from '../../../shared/assets'
import { useAppDispatch, useTypedSelector } from 'shared/store'
import { changeGoal, destroyGoal, fetchGoalsByUserId, IGoalItem } from '../../../entities/goals'
import { GOALS_ROUTE } from '../../../shared/config'

export const Subgoals: FC = () => {
    const { id } = useParams()
    const goalId = Number(id)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { user } = useTypedSelector(state => state.user)
    // const [goal, setGoal] = useState({})
    const [progress, setProgress] = useState(0)
    const [subgoals, setSubgoals] = useState<IGoalItem[]>([])
    const [subgoalInfo, setSubgoalInfo] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [goalInfo, setGoalInfo] = useState('')
    const [goalPrevInfo, setGoalPrevInfo] = useState('')

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    const fetchProgress = useCallback(async () => {
        const progress = await getGoalProgress(goalId)
        setProgress(progress.progress)
    }, [goalId])

    const fetchSubgoals = useCallback(async () => {
        const subgoals = await getGoalItems(goalId)
        setSubgoals(subgoals)
        fetchProgress()
    }, [goalId, fetchProgress])

    useEffect(() => {
        if (user) {
            dispatch(fetchGoalsByUserId(user?.id))
        }

        const fetchGoal = async () => {
            try {
                if (id) {
                    const goal = await getGoal(goalId)
                    // setGoal(goal)
                    setGoalInfo(goal.info)
                    setGoalPrevInfo(goal.info)

                    fetchSubgoals()
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    alert(`При получении цели возникла ошибка: ${error.message}`)
                } else {
                    alert("При получении цели возникла неизвестная ошибка")
                }
            }
        }

        fetchGoal()
    }, [dispatch, goalId, id, user, fetchSubgoals])

    const updateGoal = async () => {
        if (goalId && goalInfo) {
            dispatch(changeGoal({ goalId: goalId, info: goalInfo }))
        }
    }

    const deleteGoal = async () => {
        if (goalId) {
            dispatch(destroyGoal(goalId))
            navigate(GOALS_ROUTE)
        }
    }

    const addSubgoal = async (event: { preventDefault: () => void }) => {
        event.preventDefault()
        try {
            await createGoalItem(goalId, subgoalInfo)
            fetchSubgoals()
            setSubgoalInfo('')
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                alert(`При добавлении цели возникла ошибка: ${error.message}`)
            } else {
                alert("При добавлении цели возникла неизвестная ошибка")
            }
        }
    }

    const changeSubgoal = async (goalItemId: number, info: string) => {
        if (info && goalItemId) {
            await updateGoalItem(goalItemId, info)
            fetchSubgoals()
        }
    }

    const changeSubgoalStatus = async (goalItemId: number, status: boolean) => {
        if (goalItemId) {
            await updateGoalItemStatus(goalItemId, status)
            fetchSubgoals()
        }
    }

    const destroySubgoal = async (goalItemId: number) => {
        if (goalItemId) {
            await deleteGoalItem(goalItemId)
            fetchSubgoals()
        }
    }

    const handleSpanClick = () => {
        setIsEditing(true)
    }

    const handleInputBlur = () => {
        if (goalPrevInfo !== goalInfo && goalInfo.trim() !== '') {
            updateGoal()
        } else {
            setGoalInfo(goalPrevInfo)
        }
        setIsEditing(false)
    }

    const goalInfoChangeHandler = (event: { target: { value: SetStateAction<string> } }) => {
        setGoalInfo(event.target.value)
    }

    const subgoalInfoChangeHandler = (event: { target: { value: SetStateAction<string> } }) => {
        setSubgoalInfo(event.target.value)
    }

    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.goal__wrapper}>
                    {isEditing ? (
                        <input
                            type="text"
                            className={classes.input}
                            value={goalInfo}
                            onChange={goalInfoChangeHandler}
                            onBlur={handleInputBlur}
                            autoFocus
                            required
                        />
                    ) : (
                        <h3 className={classes.title} onClick={handleSpanClick}>{goalInfo}</h3>
                    )}
                    <h4 className={classes.title}>Так держать!</h4>
                    <div className={classes.goal__progress}>
                        <progress className={classes.goal__progressbar} id="progressbar" value={progress} max="100">{progress}%</progress>
                        <label className={classes.title} htmlFor="progressbar">{progress}%</label>
                    </div>
                    <div className={classes.goal__listbox}>
                        {subgoals && subgoals.length > 0 ? (
                            <div className={classes.goal__list}>
                                {subgoals.map((goalItem) => (
                                    <GoalCheckbox
                                        key={goalItem.id}
                                        goalItemId={goalItem.id}
                                        label={goalItem.info}
                                        checked={goalItem.status}
                                        changeSubgoal={changeSubgoal}
                                        changeSubgoalStatus={changeSubgoalStatus}
                                        destroySubgoal={destroySubgoal}

                                    />
                                ))}
                            </div>
                        ) : (
                            <h4 className={classes.title}>Задачи не обнаружены</h4>
                        )}
                    </div>
                    <form className={classes.goal__form}>
                        <input className={classes.input}
                            type="text" placeholder="Название"
                            value={subgoalInfo}
                            onChange={subgoalInfoChangeHandler}
                            required />
                        <img src={addIcon} />
                        <input className={classes.goal__addbutton}
                            type="submit" value="Добавить"
                            onClick={addSubgoal} />
                    </form>
                    <button className={classes.goal__button_delete} onClick={deleteGoal}>
                        <img src={deleteIcon} alt='Иконка для удаления цели' />
                        Удалить цель
                    </button>
                </div>
            </div>
        </>
    )
}