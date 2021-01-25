import { useState, useCallback, useEffect } from 'react'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)

    const userData = "userData"

    const login = useCallback(
        (jwtToken, id) => {
            setToken(jwtToken)
            setUserId(id)
            
            localStorage.setItem(userData, JSON.stringify({ jwtToken, id }))

        }, [])

    const logout = useCallback(
        () => {
            setToken(null)
            setUserId(null)

            localStorage.removeItem(userData)
        }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(userData))
        if (data && data.jwtToken) {
            
            login(data.jwtToken, data.id)
        }
    }, [login])

    return { login, logout, token, userId }
}