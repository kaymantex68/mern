const express = require('express')
const config = require('config')
const mongoose = require('mongoose')


PORT = config.get('port') || 5000

const app = express()
/**
 * в app.use передаем middleware (роутер), который будет обрабатывать api запросы
 * с фронтенда , первая часть это префикс, далее сам роутер
 */
app.use('/api/auth', require('./routes/auth.routes'))
/**
 * middleware  для парсинга в json формате
 */
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


const start = async () => {
    try {
        await mongoose.connect(config.get('mongoConnect'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        app.listen(PORT, () => { console.log(`server run on port ${PORT}`) })
    } catch (e) {
        console.log('ERROR: ', e.message)
        process.exit(1)
    }
}

start()



