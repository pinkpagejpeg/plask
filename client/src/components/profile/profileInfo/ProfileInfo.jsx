import React, { useState, useEffect } from 'react'
import classes from './ProfileInfo.module.scss'
import { updateUserInfo } from '../../../http/userApi'

const ProfileInfo = ({user, updateUser}) => {
    const [email, setEmail] = useState(user.email)
    const [prevEmail, setPrevEmail] = useState(user.email)
    const [isEmailEditing, setIsEmailEditing] = useState(false)
    const [password, setPassword] = useState('')
    const [prevPassword, setPrevPassword] = useState(user.password)
    const [isPasswordEditing, setIsPasswordEditing] = useState(false)

    const handleEmailEdit = () => {
        setIsEmailEditing(true);
    };

    const handleEmailBlur = () => {
        if (prevEmail !== email && email.trim() !== '') {
            changeUserInfo()
        } else {
            setEmail(prevEmail)
        }
        setIsEmailEditing(false)
    };

    const handlePasswordEdit = () => {
        setIsPasswordEditing(true);
    };

    const handlePasswordBlur = () => {
        if (prevPassword !== password && password.trim() !== '') {
            changeUserInfo()
        } else {
            setPassword(prevPassword)
        }
        setIsPasswordEditing(false)
        setPassword('')
    };

    const changeUserInfo = async () => {
        try {
            let data

            data = await updateUserInfo(user.id, email, password)
            updateUser(data)
        } catch (e) {
            alert(e.response.data.message)
        }
    };

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
                    Пароль: {user.password}
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
    );
}

export default ProfileInfo;