import React, { useState } from 'react'
import classes from './AdminUserItem.module.scss'
import { deleteUser, updateUser } from '../../../http/userApi'
import delete_icon from '../../../assets/images/delete_icon.png'

const AdminUserItem = ({ user }) => {
    const [email, setEmail] = useState(user.email)
    const [prevEmail, setPrevEmail] = useState(user.email)
    const [password, setPassword] = useState('')
    const [prevPassword, setPrevPassword] = useState(user.password)
    const [role, setRole] = useState(user.role)
    const [isEmailEditing, setIsEmailEditing] = useState(false)
    const [isPasswordEditing, setIsPasswordEditing] = useState(false)
    const [isRoleOpen, setIsRoleOpen] = useState(false)

    const handleEmailEdit = () => {
        setIsEmailEditing(true);
    };

    const handleEmailBlur = () => {
        if (prevEmail !== email && email.trim() !== '') {
            changeUser()
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
            changeUser()
        } else {
            setPassword(prevPassword)
        }
        setIsPasswordEditing(false)
        setPassword('')
    };

    const handleRoleClick = () => {
        setIsRoleOpen(true);
    };

    const handleRoleBlur = () => {
        changeUser()
        setIsRoleOpen(false)
    };

    const changeUser = async () => {
        try {
            let data

            data = await updateUser(user.id, email, password, role)
        } catch (e) {
            alert(e.response.data.message.message)
        }
    };

    const destroyUser = async () => {
        try {
            let data

            data = await deleteUser(user.id)
        }
        catch (e) {
            alert(e.response.data.message.message)
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
                    <img src={delete_icon} />
                </button>
            </td>
        </tr>
    );
}

export default AdminUserItem;