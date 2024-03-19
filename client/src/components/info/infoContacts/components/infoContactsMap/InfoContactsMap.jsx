import React, { useEffect } from 'react'
import classes from './InfoContactsMap.module.scss'
import { getMap } from '../../../../../utils/getMap'

const InfoContactsMap = () => {
    useEffect(() => {
        const {map, marker } = getMap()

        return () =>  {
            marker.remove()
            map.remove()
        }
    }, [])

    return (
        <div className={classes.map__wrapper}>
            <div id="map" className={classes.map__map}></div>
        </div>
    );
}

export default InfoContactsMap;