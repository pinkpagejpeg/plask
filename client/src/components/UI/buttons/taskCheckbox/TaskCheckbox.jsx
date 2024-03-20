import React, { useState } from 'react'
import classes from './TaskCheckbox.module.scss'

const TaskCheckBox = ({ label, сhecked }) => {
    const [isChecked, setIsChecked] = useState(сhecked);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className={classes.checkbox__wrapper}>
            <label>
                <input
                    type="checkbox"
                    className={classes.checkbox__input}
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                <span className={classes.checkbox__label + (isChecked ? ' ' + classes.checked : '')}>{label}</span>
            </label>
        </div>
    );
};

export default TaskCheckBox;