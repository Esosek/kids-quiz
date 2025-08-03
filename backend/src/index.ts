import express from 'express'

import errorHandler from './middleware/error_handler'
import checkAdmin from './middleware/check_admin'
import { handlerCreateUser } from './handlers/create_user'
import { handlerLogin } from './handlers/login'
import { handlerUpdateUser } from './handlers/update_user'
import { handlerCreateQuestion } from './handlers/create_question'
import { handlerGetCategories } from './handlers/get_categories'
import { handlerCreateCategory } from './handlers/create_category'
import { handlerGetSubcategories } from './handlers/get_subcategories'
import { handlerCreateSubcategory } from './handlers/create_subcategory'
import { handlerCreateUserUnlock } from './handlers/create_user_unlock'
import { handlerCreateUserAnswer } from './handlers/create_user_answer'

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.static('public'))
app.post('/api/users', handlerCreateUser)
app.put('/api/users', handlerUpdateUser)
app.post('/api/login', handlerLogin)
app.get('/api/categories', handlerGetCategories)
app.post('/api/categories', checkAdmin, handlerCreateCategory)
app.get('/api/subcategories', handlerGetSubcategories)
app.post('/api/subcategories', checkAdmin, handlerCreateSubcategory)
app.post('/api/questions', checkAdmin, handlerCreateQuestion)
app.post('/api/user_unlocks', handlerCreateUserUnlock)
app.post('/api/user_answers', handlerCreateUserAnswer)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
