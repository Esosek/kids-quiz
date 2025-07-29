import { describe, it, expect, vi } from 'vitest'

import { getCategories, createCategory } from '../categories'
import { type Category } from '../../../db/schema'

const { MOCK_DATA } = vi.hoisted(() => ({
  MOCK_DATA: [
    {
      id: '07b43f0b-9b59-4ca7-8225-3b0c09c64b53',
      createdAt: new Date(),
      updatedAt: new Date(),
      label: 'Dopravní značky',
    },
    {
      id: 'ad050506-e87e-4cc0-8753-076401420f53',
      createdAt: new Date(),
      updatedAt: new Date(),
      label: 'Vesmír',
    },
  ] as Category[],
}))

vi.mock('../../../db/index', () => {
  return {
    db: {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnValue(MOCK_DATA),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn((values) => {
        return {
          onConflictDoNothing: vi.fn().mockReturnThis(),
          returning: vi
            .fn()
            .mockReturnValue([{ ...MOCK_DATA[0], label: values.label }]),
        }
      }),
    },
  }
})

describe('Getting categories', () => {
  it('should return multiple category data', async () => {
    const result = await getCategories()

    expect(result).toHaveLength(MOCK_DATA.length)
    expect(result[0].label).toBe(MOCK_DATA[0].label)
  })
})

describe('Creating a category', () => {
  it('should return category data', async () => {
    const label = 'Dopravní značky II'
    const result = await createCategory(label)

    expect(result.id).toBeTypeOf('string')
    expect(result.label).toBe(label)
    expect(result).toHaveProperty('createdAt')
    expect(result).toHaveProperty('updatedAt')
  })
})
