import express from 'express'
import { handlerCreateUser } from './handlers/users_handler'
import errorHandler from './middleware/error_handler'

const app = express()
const PORT = 8080

app.use(express.json())
app.post('/api/users', handlerCreateUser)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
