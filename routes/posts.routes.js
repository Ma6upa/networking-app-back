const { Router } = require('express')
const Post = require('../models/User')
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
  '/createPost',
  async (req, res) => {
    try {
      const { postText, author  } = req.body
      const post = new Post({
        postText: postText,
        author: {
          id: author.id,
          name: author.name,
        }, 
        postPathToImg: `${fileName}${fileExt}`,

      })
      await post.save()

      res.status(201).json({ message: 'Пост создан' })
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
)

router.post('/uploadPostPic', upload.single('postPic'), (req, res) => {
  // All good
  res.status(200).json({ message: 'Загрузка фотографии успешно завершена' });
})

module.exports = router