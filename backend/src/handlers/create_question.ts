import { Request, Response, NextFunction } from 'express'
import validator from 'validator'
import fs from 'fs'
import { storage } from '../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { ValidationError } from '../types/errors'
import { createQuestion } from '../db/queries/questions'

export async function handlerCreateQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const body = validateBody(req)
    let imageURL: string | undefined
    if (body.image) {
      const imageFileName = body.answers[0].toLowerCase().replace(/\s+/g, '_') + '.png'
      const imageRef = ref(storage, `question_images/subcategory_${body.subcategoryId}/` + imageFileName)
      const fileBuffer = body.image.buffer
      await uploadBytes(imageRef, fileBuffer, {
        contentType: 'image/png',
      })
      imageURL = await getDownloadURL(imageRef)
    }

    const createdQuestion = await createQuestion({ ...body, imgUrl: imageURL })

    res.status(201).json(createdQuestion)
  } catch (error) {
    next(error)
  }
}

function validateBody(req: Request): {
  answers: string[]
  subcategoryId: string
  image?: Express.Multer.File
  text?: string
} {
  const validationErrors: string[] = []

  if (!req.body) {
    throw new ValidationError('Missing request body')
  }

  if (!req.body.answers) {
    validationErrors.push('Missing answers field')
  } else if (typeof req.body.answers !== 'string') {
    validationErrors.push('Answers must be a string')
  }

  if (!req.body.subcategoryId) {
    validationErrors.push('Missing subcategoryId field')
  } else if (typeof req.body.subcategoryId !== 'string' || !validator.isUUID(req.body.subcategoryId)) {
    validationErrors.push('SubcategoryId must be an UUID')
  }

  if (!req.file && !req.body.text) {
    validationErrors.push('Missing both image and text field')
  }

  if (validationErrors.length) {
    throw new ValidationError(validationErrors.join(', '))
  }

  return {
    answers: req.body.answers.split(', '),
    subcategoryId: req.body.subcategoryId,
    image: req.file,
    text: req.body.text,
  }
}
