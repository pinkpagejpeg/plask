import { useState, useEffect, useContext, FC } from 'react'
// import { observer } from 'mobx-react-lite'
// import { Context } from '../main'
import { useParams, useNavigate } from 'react-router-dom'
import classes from './Subgoals.module.scss'
import { Navbar, GoalCheckbox } from '../../../shared/ui'
import { getGoal, getGoalProgress, getGoalItems, createGoalItem, deleteGoal, updateGoal } from '../../../shared/api'
import { addIcon } from '../../../shared/assets'
import { deleteIcon } from '../../../shared/assets'
import { GOALS_ROUTE } from '../../../shared/config'

export const Subgoals: FC = () => {
    // const { goal, goalItem, user } = useContext(Context)
    const [goalInfo, setGoalInfo] = useState({})
    const navigate = useNavigate()
    const [goalItemInfo, setgoalItemInfo] = useState('')
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false)
    const [info, setInfo] = useState('')
    const [prevInfo, setPrevInfo] = useState('')

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    // useEffect(() => {
    //     const fetchGoal = async () => {
    //         try {
    //             if (id) {
    //                 const goalData = await getGoal(id);
    //                 setGoalInfo(goalData)
    //                 setInfo(goalData.info)
    //                 setPrevInfo(goalData.info)

    //                 const goalProgress = await getGoalProgress(id);
    //                 goal.setGoalProgress(id, goalProgress.progress);
    //             }
    //         } catch (e) {
    //             alert('Ошибка при получении цели:', e.response.data.message);
    //         }
    //     };

    //     const fetchGoalItems = async () => {
    //         try {
    //             if (id) {
    //                 const goalItemsData = await getGoalItems(id);
    //                 goalItem.setGoalItem(goalItemsData)
    //             }
    //         } catch (e) {
    //             alert('Ошибка при получении информации о цели:', e.response.data.message);
    //         }
    //     }

    //     fetchGoal();
    //     fetchGoalItems();
    // }, [id, user])

    // const addGoalItem = async (e) => {
    //     e.preventDefault()
    //     try {
    //         let data

    //         data = await createGoalItem(id, goalItemInfo)

    //         goalItem.addGoalItemList(data)
    //         setgoalItemInfo('')
    //         updateProgress()
    //     }
    //     catch (e) {
    //         alert(e.response.data.message)
    //     }
    // }

    // const destroyGoal = async () => {
    //     try {
    //         let data

    //         data = await deleteGoal(id)
    //         goal.removeGoal(data.deletedGoalId)
    //         navigate(`${GOALS_ROUTE}`)
    //     }
    //     catch (e) {
    //         alert(e.response.data.message)
    //     }
    // }

    // const updateProgress = async () => {
    //     try {
    //         const goalProgress = await getGoalProgress(id);
    //         goal.setGoalProgress(id, goalProgress.progress);
    //     }
    //     catch (e) {
    //         alert(e.response.data.message)
    //     }
    // };

    // const handleSpanClick = () => {
    //     setIsEditing(true)
    // };

    // const handleInputBlur = () => {
    //     if (prevInfo !== info && info.trim() !== '') {
    //         changeGoal()
    //     } else {
    //         setInfo(prevInfo)
    //     }
    //     setIsEditing(false)
    // };

    // const changeGoal = async () => {
    //     try {
    //         let data

    //         data = await updateGoal(id, info)
    //         goal.editGoal(data.goal.id, data.goal)
    //     } catch (e) {
    //         alert(e.response.data.message);
    //     }
    // }

    return (
        <>
            <Navbar />
            {/* <div className={classes.container}>
                <div className={classes.goal__wrapper}>
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
                        <h3 className={classes.title} onClick={handleSpanClick}>{info}</h3>
                    )}
                    <h4 className={classes.title}>Так держать!</h4>
                    <div className={classes.goal__progress}>
                        <progress className={classes.goal__progressbar} id="progressbar" value={goal.goalProgress[id]} max="100">{goal.goalProgress[id]}%</progress>
                        <label className={classes.title} htmlFor="progressbar">{goal.goalProgress[id]}%</label>
                    </div>
                    <div className={classes.goal__listbox}>
                        {goalItem.goalItem && goalItem.goalItem.length > 0 ? (
                            <div className={classes.goal__list}>
                                {goalItem.goalItem.map((goalItem) => (
                                    <GoalCheckbox key={goalItem.id} goalItemId={goalItem.id} label={goalItem.info} сhecked={goalItem.status} updateProgress={updateProgress} />
                                ))}
                            </div>
                        ) : (
                            <h4 className={classes.title}>Задачи не обнаружены</h4>
                        )}
                    </div>
                    <form className={classes.goal__form}>
                        <input className={classes.input}
                            type="text" placeholder="Название"
                            value={goalItemInfo}
                            onChange={e => setgoalItemInfo(e.target.value)}
                            required />
                        <img src={addIcon} />
                        <input className={classes.goal__addbutton}
                            type="submit" value="Добавить"
                            onClick={addGoalItem} />
                    </form>
                    <button className={classes.goal__button_delete} onClick={destroyGoal}>
                        <img src={deleteIcon} alt='Иконка для удаления задачи' />
                        Удалить цель
                    </button>
                </div>
            </div> */}
        </>
    )
}