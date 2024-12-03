import { FC, useState } from 'react'
import classes from './UserItem.module.scss'
import { deleteUser, updateUser } from '../../../../shared/api'
import { deleteIcon } from '../../../../shared/assets'
import { IUserItem } from './types'

export const UserItem: FC<IUserItem> = ({ user, onUserChange }) => {
    const [email, setEmail] = useState(user.email)
    const [prevEmail, setPrevEmail] = useState(user.email)
    const [password, setPassword] = useState('')
    const [prevPassword, setPrevPassword] = useState(user.password)
    const [role, setRole] = useState(user.role)
    const [prevRole, setPrevRole] = useState(user.role)
    const [isEmailEditing, setIsEmailEditing] = useState(false)
    const [isPasswordEditing, setIsPasswordEditing] = useState(false)
    const [isRoleOpen, setIsRoleOpen] = useState(false)

    const handleEmailEdit = () => {
        setIsEmailEditing(true)
    }

    const handleEmailBlur = () => {
        if (prevEmail !== email && email.trim() !== '') {
            changeUser()
            setPrevEmail(email)
        } else {
            setEmail(prevEmail)
        }
        setIsEmailEditing(false)
    }

    const handlePasswordEdit = () => {
        setIsPasswordEditing(true)
    }

    const handlePasswordBlur = () => {
        if (prevPassword !== password && password.trim() !== '') {
            changeUser()
            setPrevPassword(password)
        } else {
            setPassword(prevPassword)
        }
        setIsPasswordEditing(false)
        setPassword('')
    }

    const handleRoleClick = () => {
        setIsRoleOpen(true);
    }

    const handleRoleBlur = () => {
        if (prevRole !== role && role.trim() !== '') {
            changeUser()
            setPrevRole(role)
        } else {
            setRole(prevRole)
        }
        setIsRoleOpen(false)
    }

    const changeUser = async () => {
        try {
            await updateUser(user.id, email, password, role)
            onUserChange()
        } catch (error) {
            alert(`Ошибка при изменении пользователя: ${error.response.data}`)
        }
    }

    const destroyUser = async () => {
        try {
            await deleteUser(user.id)
            onUserChange()
        }
        catch (error) {
            alert(`Ошибка при удалении пользователя: ${error.response.data}`)
        }
    }

    return (
        <tr className={classes.user__table_main}>
            <td className={classes.main_text}>{user.id}</td>
            <td className={classes.main_text}>{isEmailEditing ? (
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
                <span onClick={handleEmailEdit}>{user.email}</span>
            )}</td>
            <td className={classes.main_text}>{isPasswordEditing ? (
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
                <span onClick={handlePasswordEdit}>{user.password}</span>
            )}</td>
            <td className={classes.main_text}>{isRoleOpen ? (
                <select
                    className={classes.input}
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    onBlur={handleRoleBlur}
                    autoFocus
                    required
                >
                    <option value='USER'>Пользователь</option>
                    <option value='ADMIN'>Администратор</option>
                </select>
            ) : (
                <span onClick={handleRoleClick}>{user.role}</span>
            )}</td>
            <td className={classes.main_text}>
                <button className={classes.user__button} onClick={destroyUser}>
                    <img src={deleteIcon} />
                </button>
            </td>
        </tr>
    )
}