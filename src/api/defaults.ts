import { fromEnv } from '@/config/env.config'
import axios from 'axios'

axios.defaults.baseURL = fromEnv.APP_BACKEND_URL
axios.defaults.responseType = 'json'
axios.defaults.validateStatus = (status) => {
    switch (status) {
        case 200:
            return true
        case 201:
            return true
        default:
            return false
    }
}

axios.interceptors.request.use(
    function (config) {
        devLog(`Request to ${config.url} (${config.auth ? '🔒' : '🔓'}). ${config.data ? 'Payload:' : ''}`, config.data ? config.data : '')

        return config
    },
    function (error) {
        devLog('Error while sending request', error)
        throw error
    },
)

axios.interceptors.response.use(
    function (response) {
        devLog(`Response from ${response.config.url}. ${response.data ? 'Response body:' : ''}`, response.data ? response.data : '')

        return response
    },
    function (error) {
        devLog('Error while receiving response', error)
        throw error
    },
)
