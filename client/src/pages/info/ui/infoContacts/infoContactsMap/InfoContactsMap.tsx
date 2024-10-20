import { FC, useEffect } from 'react'
import classes from './InfoContactsMap.module.scss'
import { getMap } from '../../../../../shared/lib'

export const InfoContactsMap: FC = () => {
    useEffect(() => {
        const { map, marker } = getMap()

        return () => {
            marker.remove()
            map.remove()
        }
    }, [])

    return (
        <div className={classes.map__wrapper}>
            <div id="map" className={classes.map__map}></div>
        </div>
    )
}