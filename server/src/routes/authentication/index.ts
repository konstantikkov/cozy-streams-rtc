import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import prisma from '../../utils/db'

const router = Router()

router
    .post('/', async (req, res) => {
        const { username, password } = req.body

        const user = await prisma.user.findFirst({
            where: { username }
        })

        if (!user) {
            const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT))

            const createdUser = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword
                }
            })
            const token = jwt.sign(
                { userId: createdUser.id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            )

            const body = {
                type: 'success',
                message: 'Успешная регистрация',
                token,
                username
            }

            return res.cookie('token', token).json(body)
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            )

            const body = {
                type: 'success',
                message: 'Успешный вход',
                token,
                username
            }

            return res.cookie('token', token).json(body)
        }

        const body = {
            type: 'error',
            message: 'Неверный логин или пароль'
        }

        return res.status(401).json(body)
    })

export default router
