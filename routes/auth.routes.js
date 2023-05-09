const { Router } = require('express')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const config = require('config')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = Router()
const path = require('path')
const multer = require('multer')

let fileName;
let fileExt;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    fileName = Date.now()
    fileExt = path.extname(file.originalname)
    cb(null, fileName + path.extname(file.originalname))
  }
})

const upload = multer({storage: storage})

router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации'
        })
      }

      const { email, password, firstName, lastName, birthDate, city, university } = req.body
      const candidate = await User.findOne({ email })

      if (candidate) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ 
        email, 
        password: hashedPassword,
        pathToUserpic: `${fileName}${fileExt}`,
        firstName,
        lastName,
        birthDate,
        city,
        university,

      })
      await user.save()

      res.status(201).json({ message: 'Пользователь создан' })
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
)

router.post('/upload', upload.single('avatar'), (req, res) => {
  // All good
  res.status(200).json({ message: 'Загрузка фотографии успешно завершена' });
})

router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при входе в систему'
        })
      }
      const { email, password } = req.body
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
      }

      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      )

      res.json({ token, userId: user.id })

    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
)

module.exports = router