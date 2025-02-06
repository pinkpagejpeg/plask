import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import classes from './Profile.module.scss'
import { Navbar } from '../../../shared/ui'
import { deleteIcon, uploadIcon } from '../../../shared/assets'
import { REGISTRATION_ROUTE } from '../../../shared/config'
import { ProfileInfo } from './profileInfo'
import { useAppDispatch, useTypedSelector } from 'shared/store'
import { changeUserImage, destroyUser, destroyUserImage } from '../../../entities/users'

export const Profile: FC = () => {
    const { user } = useTypedSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />
    // }

    const fileChangeHandler = (event) => {
        selectFile(event)
    }

    const selectFile = (event) => {
        const file = event.target.files[0]

        if (!file) {
            alert('Файл не загружен')
        }

        updateUserImage(file)
    }

    const updateUserImage = async (file: string | Blob) => {
        try {
            if (user) {
                const formData = new FormData()
                formData.append('file', file)

                dispatch(changeUserImage({ userId: user?.id, formData }))
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`При изменении фото профиля возникла ошибка: ${error.message}`)
            } else {
                alert("При изменении фото профиля возникла неизвестная ошибка")
            }
        }
    }

    const deleteUserImage = async () => {
        try {
            if (user) {
                dispatch(destroyUserImage(user?.id))
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`При удалении фото профиля возникла ошибка: ${error.message}`)
            } else {
                alert("При удалении фото профиля возникла неизвестная ошибка")
            }
        }
    }

    const deleteUser = async () => {
        try {
            if (user) {
                const confirmed = window.confirm("Вы уверены, что хотите удалить аккаунт?")
                if (confirmed) {
                    dispatch(destroyUser(user?.id))
                    localStorage.removeItem('token')
                    navigate(REGISTRATION_ROUTE)
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`При удалении профиля возникла ошибка: ${error.message}`)
            } else {
                alert("При удалении профиля возникла неизвестная ошибка")
            }
        }
    }

    return (
        <>
            <Navbar />
            <div className={classes.profile__wrapper}>
                <h2 className={classes.plask}>Plask</h2>
                <h3 className={classes.title}>Профиль</h3>
                <div className={classes.profile__mainbox}>
                    <div className={classes.profile__imagebox}>
                        <img src={import.meta.env.VITE_API_URL + 'static/' + user?.img} />
                        <div className={classes.profile__image_buttons}>
                            <label htmlFor="file-upload" className={classes.profile__image_button}>
                                <img src={uploadIcon} alt="Загрузить фото профиля" />
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={fileChangeHandler}
                            />
                            <button className={classes.profile__image_button} onClick={deleteUserImage}>
                                <img src={deleteIcon} alt='Удалить фото профиля' />
                            </button>
                        </div>
                    </div>
                    <div className={classes.profile__infobox}>
                        <ProfileInfo />
                        <button className={classes.profile__button_delete} onClick={deleteUser}>
                            Удалить аккаунт
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}