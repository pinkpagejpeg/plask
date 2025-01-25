import { FC, useState } from 'react'
import classes from './InfoFaq.module.scss'

export const InfoFaq: FC = () => {
    const faqData = [
        {
            question: 'Синхронизируются ли данных между устройствами?',
            answer: 'Да, мы предоставляем функцию синхронизации данных, которая позволяет вам легко доступиться к вашим задачам и целям с любого устройства. Ваши данные автоматически синхронизируются, обеспечивая консистентность и доступность.'
        },
        {
            question: 'Что делать если у меня возникнут проблемы с сайтом?',
            answer: 'Мы предоставляем круглосуточную поддержку пользователям через различные каналы связи, включая онлайн-чат, электронную почту и телефон. Наша команда поддержки готова ответить на ваши вопросы, помочь с решением проблем и предоставить поддержку по всем аспектам использования сайта.'
        },
        {
            question: 'Как обеспечивается конфиденциальность моих данных?',
            answer: 'Мы придаем высокое значение конфиденциальности данных наших пользователей и применяем все необходимые меры для защиты вашей личной информации. Все данные передаются по защищенным протоколам, а доступ к ним имеют только авторизованные пользователи.'
        }
    ]

    const [expandedIndex, setExpandedIndex] = useState(null)

    const toggleAnswer = (index) => {
        if (expandedIndex === index) {
            setExpandedIndex(null)
        } else {
            setExpandedIndex(index)
        }
    }

    return (
        <div className={classes.faq__wrapper} id="faq">
            <h2 className={classes.section_title}>Часто задаваемые вопросы</h2>
            <div className={classes.faq__infobox}>
                {faqData.map((item, index) => (
                    <div key={index} className={classes.faq__item}>
                        <div className={classes.title} onClick={() => toggleAnswer(index)}>
                            {item.question}
                        </div>
                        {expandedIndex === index && (
                            <div className={classes.main_text}>
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}