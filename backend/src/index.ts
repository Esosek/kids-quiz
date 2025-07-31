import express from 'express'

import errorHandler from './middleware/error_handler'
import checkAdmin from './middleware/check_admin'
import { handlerCreateUser } from './handlers/create_user'
import { handlerLogin } from './handlers/login'
import { handlerUpdateUser } from './handlers/update_user'
import { handlerCreateQuestion } from './handlers/create_question'
import { handlerCreateCategory } from './handlers/create_category'

const app = express()
const PORT = 8080

app.use(express.json())
app.post('/api/users', handlerCreateUser)
app.put('/api/users', handlerUpdateUser)
app.post('/api/login', handlerLogin)
app.post('/api/categories', checkAdmin, handlerCreateCategory)
app.post('/api/questions', checkAdmin, handlerCreateQuestion)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
