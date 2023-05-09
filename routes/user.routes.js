const { Router } = require('express')
var ObjectId = require('mongodb').ObjectId; 
const User = require('../models/User')
const router = Router()

router.get(
  '/user',
  async (req, res) => {
    try {
      const userId = new ObjectId(req.query.userId);
      const candidate = await User.findOne({ _id: userId })
      if (!candidate) {
        return res.status(400).json({ message: 'Такого пользователя не существует' })
      }
      res.json({
        id: candidate.id,
        email: candidate.email,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        avatarPath: candidate.pathToUserpic,
        birthDate: candidate.birthDate,
        city: candidate.city,
        university: candidate.university,
      })
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
)

module.exports = router