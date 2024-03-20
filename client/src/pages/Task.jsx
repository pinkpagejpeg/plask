import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../main'
import classes from '../styles/Task.module.scss'

const Task = observer(() => {
    const { user } = useContext(Context)

    if (!user) {
        return <Navigate to={LOGIN_ROUTE} />;
    }
    
    return ( 
        <div>
            <h3 className={classes.title}>Задачи</h3>
            
        </div>
     );
})
 
export default Task;