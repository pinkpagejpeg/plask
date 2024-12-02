import { FC, useEffect, useState } from 'react'
import classes from './ProfileInfo.module.scss'
import { updateUserInfo, getUser } from '../../../../shared/api'
import { useTypedSelector } from '../../../../features/hooks'

export const ProfileInfo: FC = () => {
    const { user } = useTypedSelector(state => state.user)
    const [email, setEmail] = useState('')
    const [prevEmail, setPrevEmail] = useState('')
    const [isEmailEditing, setIsEmailEditing] = useState(false)
    const [password, setPassword] = useState('')
    const [prevPassword, setPrevPassword] = useState('')
    const [isPasswordEditing, setIsPasswordEditing] = useState(false)

    useEffect(() => {
        setEmail(user.email)
        setPrevEmail(user.email)
        setPrevPassword(user.password)
    }, [user])

    const handleEmailEdit = () => {
        // setIsEmailEditing(true)
    }

    const handleEmailBlur = () => {
        // if (prevEmail !== email && email.trim() !== '') {
        //     changeUserInfo()
        //     setPrevEmail(email)
        // } else {
        //     setEmail(prevEmail)
        // }
        // setIsEmailEditing(false)
    }

    const handlePasswordEdit = () => {
        // setIsPasswordEditing(true)
    }

    const handlePasswordBlur = () => {
        // if (prevPassword !== password && password.trim() !== '') {
        //     changeUserInfo()
        //     setPrevPassword(password)
        // } else {
        //     setPassword(prevPassword)
        // }
        // setIsPasswordEditing(false)
        // setPassword('')
    }

    const changeUserInfo = async () => {
        // try {
        //     let data
        //     data = await updateUserInfo(user.id, email, password)
        //     fetchUser()
        // } catch (e) {
        //     alert(e.response.data.message)
        // }
    }

    const fetchUser = async () => {
        // try {
        //     if (user.id) {
        //         const data = await getUser(user.id)
        //         user.setUser(data)
        //     }
        // } catch (e) {
        //     alert(`Ошибка при получении информации о пользователе: ${e.response.data.message}`)
        // }
    }

    return (
        <div className={classes.profile__infobox}>
            <div className={classes.profile__infoitem}>
                <p className={classes.main_text}>
                    Email:
                    {isEmailEditing ? (
                        <input
                            type="email"
                            className={classes.input}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onBlur={handleEmailBlur}
                            autoFocus
                            required
                        />
                    ) : (
                        <span className={classes.profile__info} onClick={handleEmailEdit}> {user.email}</span>
                    )}
                </p>
            </div>
            <div className={classes.profile__infoitem}>
                <p className={classes.main_text}>
                    Пароль:
                    {isPasswordEditing ? (
                        <input
                            type="password"
                            className={classes.input}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onBlur={handlePasswordBlur}
                            autoFocus
                            required
                        />
                    ) : (
                        <span className={classes.profile__info} onClick={handlePasswordEdit}> ********</span>
                    )}
                </p>
            </div>
        </div>
    )
}