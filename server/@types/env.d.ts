declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_PORT: number
            MEETING_PORT: number
            JWT_SECRET: string
            SALT: number
        }
    }
}

export {}
