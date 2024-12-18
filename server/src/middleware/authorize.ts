import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const authorize = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    
    try {
        const token = req.cookies['token'] || req.headers.authorization
        
        // @ts-ignore
        req.userId = (token && jwt.verify(token, process.env.JWT_SECRET)).userId

        next()
    } catch (e) {
        res.sendStatus(401)
    }
}

export default authorize
