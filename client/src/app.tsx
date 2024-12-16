import { type FC, useCallback } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { useCookies } from 'react-cookie'

import Authentication from './features/authentication'
import Main from './features/main'
import Meeting from './features/meeting'

const queryClient = new QueryClient()

const COOKIE_TOKEN = 'token'
const COOKIE_USERNAME = 'username'
const AUTH_DELAY = 1000

const App: FC = () => {
    const [cookies, setCookie, removeCookie, updateCookies] = useCookies()

    const authenticated = !!cookies[COOKIE_TOKEN]
    const username = window.localStorage.getItem(COOKIE_USERNAME) || ''

    const login = useCallback((token: string, username: string) => {
        window.localStorage.setItem(COOKIE_TOKEN, token)
        window.localStorage.setItem(COOKIE_USERNAME, username)
        setCookie(COOKIE_TOKEN, token)
        setTimeout(() => {
            updateCookies()
        }, AUTH_DELAY)
    }, [])

    const logout = useCallback(() => {
        window.localStorage.removeItem(COOKIE_TOKEN)
        window.localStorage.removeItem(COOKIE_USERNAME)
        removeCookie(COOKIE_TOKEN)

        setTimeout(() => {
            updateCookies()
        }, AUTH_DELAY)
    }, [removeCookie])

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {
                        !authenticated &&
                        <Route
                            index
                            path="*"
                            element={<Authentication login={login} />}
                        />
                    }
                    { authenticated &&
                        <>
                            <Route
                                index
                                path="/meeting/:id"
                                element={<Meeting username={username}  />}
                            />
                            <Route
                                index
                                path="*"
                                element={<Main username={username} logout={logout} />}
                            />
                        </>
                    }
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
