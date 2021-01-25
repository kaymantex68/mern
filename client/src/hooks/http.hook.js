import { useState, useCallback } from 'react'
import axios from 'axios'



export const useHttp = () => {

    const [loading, setLoading] = useState(false)

    const delay = (ms) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }


    const request = useCallback(async (url, data) => {
        setLoading(true)
        const response = await axios.post(url, { ...data })
            .then(res => res)
        await delay(1)
        setLoading(false)
        return response
    }, [])



    return { request, loading }
}

