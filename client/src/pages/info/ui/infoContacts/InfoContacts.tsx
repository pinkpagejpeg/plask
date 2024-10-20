import { FC } from 'react'
import classes from './InfoContacts.module.scss'
import { InfoContactsMap } from './infoContactsMap'

export const InfoContacts: FC = () => {
    return (
        <div className={classes.contacts__wrapper} id="contacts">
            <h2 className={classes.section_title}>Контакты</h2>
            <div className={classes.contacts__content}>
                <div className={classes.contacts__info}>
                    <p className={classes.main_text}>Plask@gmail.com<br />
                        +7-495-888-7581<br />
                        г. Москва, ул. Нежинская, д. 7, 119501<br />
                        Пн - Пт 10:00 - 18:00<br /><br />

                        ИНН: 771882555989<br />
                        ОРГНИП: 328774621392308<br /><br />

                        Платежные реквизиты:<br />
                        Р/С: 40802810006938261118<br />
                        К/С: 30101810945252736297<br />
                        Банк получателя:<br />
                        Филиал Центральный ПАО Банка ОТКРЫТИЕ<br />
                        БИК 065525297</p>
                </div>
                <InfoContactsMap />
            </div>
        </div>
    )
}