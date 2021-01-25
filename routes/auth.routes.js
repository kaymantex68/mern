const { Router } = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const router = Router()
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

router.get('/register', async(req, res) => {
    const base = await User.find()
    console.log(base)
    res.send(base)

})
router.post(
    '/register',
    /**
     * middlewars можно передвать сколько угодно , и их можно передвать в массиве
     */
    [
        check('email', 'некорректный email').isEmail(),
        check('password', 'минимальная длина пароля 6 символов').isLength({ min: 6 }),
        check('name', 'минимальная длина пароля 6 символов').isLength({ min: 2 }),
        check('phone', 'минимальная длина пароля 6 символов').isLength({ min: 2 })
    ],
    async (req, res, next) => {
        try {
            /**
             * ValidatoResut вернет результат проверки миддвейров , есть ли ошибки или нет
             */
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                
                return res.json({ errors: errors.array(), message: 'некорректные данные при регистрации' })
                
            }
            /**
             *  из req должны придти данные из которых с помощью body мы берем
             *  emai и password 
             */
            console.log('req.body: ', req.body)
            const { email, password, name, phone } = req.body
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
                console.log('такой пользователь есть')
                return res.json({ message: 'такой пользователь уже есть' })
                
            }
            /**
             * если такого пользователя в базе не существует то хэшируем его с помощью метода
             * bcryptjs  и отправляем в монго (метод является асинхронным)
             */
            const hashedPassword = await bcrypt.hash(password, 12)
            /**
             * сдздаем новую запись из экземпляра модели
             */
            const user = new User({ email, password: hashedPassword, name, phone })
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
            throw e
        }
    })

router.post(
    '/login',
    /**
    * middlewars можно передвать сколько угодно , и их можно передвать в массиве
    */
    [
        check('email', 'введите корректный email').isEmail(),
        check('password', 'введите пароль').exists()
    ],
    async (req, res, next) => {
        try {
            
            /**
             * ValidatoResut вернет результат проверки миддвейров , есть ли ошибки или нет
             */
            const errors = await validationResult(req)
            
            if (!errors.isEmpty()) {    
                return res.json({ errors: errors.array(), message: 'некорректные данные при входе в систему' })
            }
            
            /**
             *  из req должны придти данные из которых с помощью body мы берем
             *  emai и password 
             */
            console.log('req,body',req.body)
            
            const { email, password } =  await req.body

            /**
             * проверяем есть ли такой пользователь в базе с помощью метода из монго
             * findOne 
             */
            
            const user = await User.findOne({ email })
            if (!user) {
                return res.json({ message: 'пользователь не найден' })
            }
            /**
             * нужно проверить совпадают ли пароли. С помощью bcrypt методом compare  мы сравниваем пароль
             * который пришел из фронтенда  password  и пароль который лежит в базе user.password. user мы получили
             * из запроса к базе  const user = await User.findOne({ email })
             */
            const isMatch = await bcrypt.compare(password, user.password)
            
            if (!isMatch) {
                return res.json({ message: 'неверный пароль, попробуйте снова' })
            }
            /**
             * создаем jwt токен. передаем три параметра
             * 1 параметр это объект в котором должны быть зашифрованы данные которые мы передаем
             * 2 параметр это секретный ключ
             * 3 параметр { expiresIn: '1h'} время сколько будет существоват токен
             */
            const token = await jwt.sign(
                { userId: user.id },
                config.get('jwtSecretKey'),
                { expiresIn: '1h' }
            )
            /**
             *  и в конце отвачаем клиенту передав токен
             */
            console.log(token, user.id)
            res.status(201).json({ token, userId: user.id, message: 'авторизация'})
        } catch (e) {
            res.json({ message: 'что-то пошло не так, попробуйте снова' })

        }
    })


module.exports = router