import { describe, it, expect, vi } from 'vitest'

import { getSubcategories, createSubcategory } from '../subcategories'
import { Subcategory } from '../../../db/schema'

const MOCK_SUBCATEGORIES = vi.hoisted(
  () =>
    [
      {
        id: '552e63a2-00f9-4e86-a078-319acc8cff33',
        createdAt: new Date(),
        updatedAt: new Date(),
        label: 'Dopravní značky I',
        categoryId: '07b43f0b-9b59-4ca7-8225-3b0c09c64b53',
      },
      {
        id: 'ae1eb936-7930-42a5-b591-889156baa37a',
        createdAt: new Date(),
        updatedAt: new Date(),
        label: 'Vesmír I',
        categoryId: null,
      },
    ] as Subcategory[]
)

vi.mock('../../../db/index', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnValue(MOCK_SUBCATEGORIES),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn((values) => ({
      onConflictDoNothing: vi.fn().mockReturnThis(),
      returning: vi.fn(() => [
        {
          ...MOCK_SUBCATEGORIES[1],
          label: values.label,
          categoryId: values.categoryId ?? null,
        },
      ]),
    })),
  },
}))

describe('Getting subcategories', () => {
  it('should return list of subcategories', async () => {
    const result = await getSubcategories()

    expect(result).toHaveLength(MOCK_SUBCATEGORIES.length)
    expect(result[0].categoryId).toBe(MOCK_SUBCATEGORIES[0].categoryId)
    expect(result[1].categoryId).toBeNull()
  })
})

describe('Creating subcategory', () => {
  const label = 'Geografie I'
  const imgUrl = 'example.com'

  it('should return created subcategory when categoryId is NOT provided', async () => {
    const result = await createSubcategory(label, imgUrl)

    expect(result.label).toBe(label)
    expect(result.categoryId).toBeNull()
    expect(result.id).toBeTypeOf('string')
  })

  it('should return created subcategory when categoryId is provided', async () => {
    const categoryId = MOCK_SUBCATEGORIES[1].categoryId
    const result = await createSubcategory(label, imgUrl, categoryId!)

    expect(result.label).toBe(label)
    expect(result.categoryId).toBe(categoryId)
    expect(result.id).toBeTypeOf('string')
  })

  // Preventing duplicities might be better tested in integration tests
})
