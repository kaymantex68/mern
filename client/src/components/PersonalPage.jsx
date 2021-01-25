import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import classes from './PersonalPage.module.css'


export const PersonalPage = () => {
    // const { logout } = useContext(AuthContext)
    return (
        <div className={classes.personal_page_container}>
            {/* <button onClick={() => logout()}>выход</button> */}
            <div>
                вы в личном кабинете
            </div>
        </div>
    )
}