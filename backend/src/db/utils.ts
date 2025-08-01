import { eq } from 'drizzle-orm'
import { PgTableWithColumns } from 'drizzle-orm/pg-core'

import { db } from './index'
import { NotFoundError } from '../types/errors'

/** @throws NotFoundError when item is not found */
export async function checkItemIdinDBTable(
  itemId: string,
  table: PgTableWithColumns<any>
) {
  const [result] = await db.select().from(table).where(eq(table.id, itemId))
  if (!result) {
    throw new NotFoundError(` ID ${itemId} not found in ${table.name} table`)
  }
}
