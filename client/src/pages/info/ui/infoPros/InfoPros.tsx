import { FC } from 'react'
import classes from './InfoPros.module.scss'
import { InfoProsCard } from './infoProsCard'
import { goals, support, progress } from '../../../../shared/assets'

export const InfoPros: FC = () => {
    return (
        <div className={classes.pros__wrapper} id="pros">
            <h2 className={classes.section_title}>Преимущества</h2>
            <div className={classes.pros__cards}>
                <InfoProsCard pros={{
                    image: goals,
                    title: 'Цели',
                    text: 'Plask имеет функцию добавления не только задач, но и целей. В цели можно добавить этапы, которые необходимы вам для ее достижения.',
                }} />
                <InfoProsCard pros={{
                    image: support,
                    title: 'Поддержка',
                    text: 'Наша служба поддержки всегда готова ответить на ваши вопросы. Задать вопрос можно в разделе “Обратная связь” с помощью формы.',
                }} />
                <InfoProsCard pros={{
                    image: progress,
                    title: 'Прогресс',
                    text: 'Plask позволяет отслеживать ваш прогресс в достижении поставленных целей, чтобы удобно было наблюдать свои успехи и планировать свои задачи.',
                }} />
            </div>
        </div>
    )
}