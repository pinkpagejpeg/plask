import React, { useState, useEffect, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../main'
import { useParams, useNavigate } from 'react-router-dom'
import classes from '../styles/GoalItem.module.scss'
import NavBar from '../components/nav/NavBar'
import { getGoal, getGoalProgress, getGoalItems, createGoalItem, deleteGoal, updateGoal } from '../http/goalApi'
import add_icon from '../assets/images/addbutton_icon.png'
import GoalCheckBox from '../components/UI/buttons/goalCheckbox/GoalCheckbox'
import delete_icon from '../assets/images/delete_icon.png'
import { GOALS_ROUTE } from '../utils/consts'

const GoalItem = observer(() => {
    const { goal, goalItem, user } = useContext(Context)
    const [goalInfo, setGoalInfo] = useState({})
    const navigate = useNavigate()
    const [goalItemInfo, setgoalItemInfo] = useState('')
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false)
    const [info, setInfo] = useState('')
    const [prevInfo, setPrevInfo] = useState('')

    if (!user) {
        return <Navigate to={LOGIN_ROUTE} />;
    }

    useEffect(() => {
        const fetchGoal = async () => {
            try {
                if (id) {
                    const goalData = await getGoal(id);
                    setGoalInfo(goalData)
                    setInfo(goalData.info)
                    setPrevInfo(goalData.info)

                    const goalProgress = await getGoalProgress(id);
                    goal.setGoalProgress(id, goalProgress.progress);
                }
            } catch (e) {
                alert('Ошибка при получении цели:', e.response.data.message);
            }
        };

        const fetchGoalItems = async () => {
            try {
                if (id) {
                    const goalItemsData = await getGoalItems(id);
                    goalItem.setGoalItem(goalItemsData)
                }
            } catch (e) {
                alert('Ошибка при получении информации о цели:', e.response.data.message);
            }
        }

        fetchGoal();
        fetchGoalItems();
    }, [id, user])

    const addGoalItem = async (e) => {
        e.preventDefault()
        try {
            let data

            data = await createGoalItem(id, goalItemInfo)

            goalItem.addGoalItemList(data)
            setgoalItemInfo('')
            updateProgress()
        }
        catch (e) {
            alert(e.response.data.message)
        }
    }

    const destroyGoal = async () => {
        try {
            let data

            data = await deleteGoal(id)
            goal.removeGoal(data.deletedGoalId)
            navigate(`${GOALS_ROUTE}`)
        }
        catch (e) {
            alert(e.response.data.message)
        }
    }

    const updateProgress = async () => {
        try {
            const goalProgress = await getGoalProgress(id);
            goal.setGoalProgress(id, goalProgress.progress);
        }
        catch (e) {
            alert(e.response.data.message)
        }
    };

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

            data = await updateGoal(id, info)
            goal.editGoal(data.goal.id, data.goal)
        } catch (e) {
            alert(e.response.data.message);
        }
    }

    return (
        <>
            <NavBar />
            <div className={classes.container}>
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
                                    <GoalCheckBox key={goalItem.id} goalItemId={goalItem.id} label={goalItem.info} сhecked={goalItem.status} updateProgress={updateProgress} />
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
                        <img src={add_icon} />
                        <input className={classes.goal__addbutton}
                            type="submit" value="Добавить"
                            onClick={addGoalItem} />
                    </form>
                    <button className={classes.goal__button_delete} onClick={destroyGoal}>
                        <img src={delete_icon} alt='Иконка для удаления задачи' />
                        Удалить цель
                    </button>
                </div>
            </div>
        </>
    );
})

export default GoalItem;