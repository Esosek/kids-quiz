import { Request, Response, NextFunction } from 'express'
import validator from 'validator'
import fs from 'fs'
import { storage } from '../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { createSubcategory } from '../db/queries/subcategories'
import { ValidationError } from '../types/errors'

export async function handlerCreateSubcategory(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new ValidationError('Missing image file')
    }
    const body = validateInput(req.body)
    const imageFileName = body.label.toLowerCase().replace(/\s+/g, '_') + '.png'
    const imageRef = ref(storage, 'subcategory_images/' + imageFileName)
    const file = fs.readFileSync(req.file.path)
    await uploadBytes(imageRef, file, {
      contentType: 'image/png',
    })
    const imageURL = await getDownloadURL(imageRef)
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(err)
        throw new Error('Removing file from file system failed')
      }
    })

    const createdSubcategory = await createSubcategory(body.label, imageURL, body.categoryId, body.unlockPrice)
    res.status(201).json(createdSubcategory)
  } catch (error) {
    next(error)
  }
}

function validateInput(reqBody: any): {
  label: string
  categoryId?: string
  unlockPrice?: number
} {
  if (!reqBody) {
    throw new ValidationError('Missing request body')
  }

  if (!reqBody.label || typeof reqBody.label !== 'string') {
    throw new ValidationError('Label is missing or in invalid format')
  }

  if (reqBody.label.length < 4 || reqBody.label.length > 64) {
    throw new ValidationError('Label must be between 3 and 64 characters long')
  }

  if (reqBody.categoryId && !validator.isUUID(reqBody.categoryId)) {
    throw new ValidationError('CategoryId is in invalid format')
  }

  const unlockPrice = parseInt(reqBody.unlockPrice)
  if (reqBody.unlockPrice && isNaN(unlockPrice)) {
    throw new ValidationError('Unlock price is in invalid format')
  }
  return {
    label: reqBody.label,
    categoryId: reqBody.categoryId,
    unlockPrice,
  }
}
