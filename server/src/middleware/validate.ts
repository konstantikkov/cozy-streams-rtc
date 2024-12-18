import { NextFunction, Request, Response } from 'express'

const MIN_LENGTH = 6

const validate = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const { username, password } = req?.body || {}

        if (username?.length < MIN_LENGTH || password?.length < MIN_LENGTH) {
            throw 'Минимальная длина никнейма и пароля - 6 символов'
        }

        next()
    } catch (error) {
        const body = {
            type: 'error',
            message: error as string
        }

        return res.status(400).json(body)
    }
}

export default validate
