import { FC, useEffect, useState } from 'react'
import classes from './ProfileInfo.module.scss'
import { useAppDispatch, useTypedSelector } from '../../../../features/hooks'
import { changeUserInfo } from '../../../../entities/users'

export const ProfileInfo: FC = () => {
    const { user } = useTypedSelector(state => state.user)
    const [email, setEmail] = useState('')
    const [prevEmail, setPrevEmail] = useState('')
    const [isEmailEditing, setIsEmailEditing] = useState(false)
    const [password, setPassword] = useState('')
    const [isPasswordEditing, setIsPasswordEditing] = useState(false)
    const dispatch = useAppDispatch()

    useEffect(() => {
        setEmail(user.email)
        setPrevEmail(user.email)
    }, [user])

    const handleEmailEdit = () => {
        setIsEmailEditing(true)
    }

    const handleEmailBlur = () => {
        if (user.id) {
            if (prevEmail !== email && email.trim() !== '') {
                dispatch(changeUserInfo({ userId: user.id, email: email, password: password }))
                setPrevEmail(email)
            } else {
                setEmail(prevEmail)
            }
            setIsEmailEditing(false)
        }
    }

    const handlePasswordEdit = () => {
        setIsPasswordEditing(true)
    }

    const handlePasswordBlur = () => {
        if (user.id) {
            if (password.trim() !== '') {
                dispatch(changeUserInfo({ userId: user.id, email: email, password: password }))
            }
            setIsPasswordEditing(false)
            setPassword('')
        }
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
