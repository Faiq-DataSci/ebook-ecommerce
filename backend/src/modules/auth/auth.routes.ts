import { Router } from 'express'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { syncUserSchema } from '../users/user.schema.js'
import { syncAuthController } from './auth.controller.js'

export const authRouter = Router()

authRouter.post('/sync', authenticate, validate({ body: syncUserSchema }), syncAuthController)
