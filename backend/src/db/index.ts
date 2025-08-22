import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

import * as schema from '../db/schema'
import config from '../config'

const conn = postgres(config.db.url, { prepare: false })
export const db = drizzle(conn, { schema })
