import express from 'express'
import { handlerCreateUser } from './handlers/users_handler'

const app = express()
const PORT = 8080

app.use(express.json())
app.post('/api/users', handlerCreateUser)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
