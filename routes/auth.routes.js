const { Router } = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const router = Router()
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

router.post(
    '/register',
    /**
     * middlewars можно передвать сколько угодно , и их можно передвать в массиве
     */
    [
        check('email', 'некорректный email').isEmail(),
        check('password', 'минимальная длина пароля 6 символов').isLength({ min: 6 })
    ],
    async (req, res, next) => {
        try {
            /**
             * ValidatoResut вернет результат проверки миддвейров , есть ли ошибки или нет
             */
            const errors = validationResult(req)
            if (!errors.isEmpty) {
                return res.status(400).json({ errors: errors.array(), message: 'некорректные данные при регистрации' })
            }
            /**
             *  из req должны придти данные из которых с помощью body мы берем
             *  emai и password 
             */
            const { email, password } = req.body
            console.log(req.body)
            /**
             * проверяем есть ли такой пользователь в базе с помощью метода из монго
             * findOne 
             */
            const candidate = await User.findOne({ email })
            /**
             * если такой пользователь есть, то возвращаем статут 400 и сообщение
             * что такой пользователь уже существует
             */
            if (candidate) {
                return res.status(400).json({ message: 'такой пользователь уже есть' })
            }
            /**
             * если такого пользователя в базе не существует то хэшируем его с помощью метода
             * bcryptjs  и отправляем в монго (метод является асинхронным)
             */
            const hashedPassword = await bcrypt.hash(password, 12)
            /**
             * сдздаем новую запись из экземпляра модели
             */
            const user = new User({ email, password: hashedPassword })
            /**
             * отправляем эту запись в базу данных ( метод асинхронный)
             */
            await user.save()
            /**
             * по окончании процесса возвращаем статус 201 и сообщение о создании пользователя
             */
            res.status(201).json({ message: 'пользователь создан' })
        } catch (e) {
            res.status(500).json({ message: 'что-то пошло не так, попробуйте снова' })

        }
    })

router.post(
    '/login',
    /**
    * middlewars можно передвать сколько угодно , и их можно передвать в массиве
    */
    [
        check('email', 'введите корректный email').normalizeEmail().isEmail(),
        check('password', 'введите пароль').exists()
    ],
    async (req, res, next) => {
        try {
            /**
             * ValidatoResut вернет результат проверки миддвейров , есть ли ошибки или нет
             */
            const errors = validationResult(req)
            if (!errors.isEmpty) {
                return res.status(400).json({ errors: errors.array(), message: 'некорректные данные при входе в систему' })
            }
            /**
             *  из req должны придти данные из которых с помощью body мы берем
             *  emai и password 
             */
            const { email, password } = req.body
            /**
             * проверяем есть ли такой пользователь в базе с помощью метода из монго
             * findOne 
             */
            const user = await User.findOne({ email })
            if (!user) {
                res.status(400).json({ message: 'пользователь не найден' })
            }
            /**
             * нужно проверить совпадают ли пароли. С помощью bcrypt методом compare  мы сравниваем пароль
             * который пришел из фронтенда  password  и пароль который лежит в базе user.password. user мы получили
             * из запроса к базе  const user = await User.findOne({ email })
             */
            const isMatch = bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: 'неверный пароль, попробуйте снова' })
            }
            /**
             * создаем jwt токен. передаем три параметра
             * 1 параметр это объект в котором должны быть зашифрованы данные которые мы передаем
             * 2 параметр это секретный ключ
             * 3 параметр { expiresIn: '1h'} время сколько будет существоват токен
             */
            const tokken = jwt.sign(
                { userId: user.id },
                config.get('jwtSecretKey'),
                { expiresIn: '1h'}
            )
            /**
             *  и в конце отвачаем клиенту передав токен
             */
            res.json({token, userId: user.id})
        } catch (e) {
            res.status(500).json({ message: 'что-то пошло не так, попробуйте снова' })

        }
    })


module.exports = router