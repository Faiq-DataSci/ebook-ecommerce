import { Router } from 'express'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { getMeController, updateMeController } from './user.controller.js'
import { updateProfileSchema } from './user.schema.js'

export const userRouter = Router()

userRouter.use(authenticate)

userRouter.get('/me', getMeController)
userRouter.patch('/me', validate({ body: updateProfileSchema }), updateMeController)
