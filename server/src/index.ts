import express from 'express'
import cors from 'cors'
import https from 'https'
import cookieParser from 'cookie-parser'
import path from 'path'

import apiRouter from './routes'
import meeting from './routes/meeting'
import fs from 'fs'

const options: https.ServerOptions = {
    key: fs.readFileSync(path.join(__dirname, '..', 'data', 'certificates', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'data', 'certificates', 'cert.pem'))
}

const app = express()

app.use(cors({
    credentials: true, // Allow credentials (cookies, HTTP auth)
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api', apiRouter)

app.use('/', express.static(path.join(__dirname, '..', '..', '..', 'client', 'dist')))
app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, '..', '..', '..', 'client', 'dist', 'index.html'))
})

const server = https.createServer(options)

meeting.startMeetingServer(server)

server.on('request', app)

server.listen(process.env.API_PORT, () => {
    console.log(`listen port ${process.env.API_PORT}`)
})
