import { NextFunction, Request, Response } from 'express'
import { loginUser } from '../../services/auth/methods'
import google from '../../services/auth/oauth2/google'
import { createUser, getUserByGoogleID } from '../../services/user/methods'
import { HTTP400Error } from '../../util/errors/httpErrors'

export default [
  {
    path: '/auth/google',
    method: 'post',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const { access_token } = req.body

        try {
          if (!access_token) {
            throw new HTTP400Error('Missing access_token')
          }
          const userData = await google.getUserData(access_token)
          if (!userData) {
            throw new Error('Failed getting user data from google oauth2.')
          }

          const user = await getUserByGoogleID(userData.id)
          console.log(user)
          if (!user) { // TODO: Should this prompt to a new page to fill new data ??? or this is the default
            // create new user
            const freshUser = await createUser({
              email: userData.email,
              name: userData.name,
              google_id: userData.id,
              //TODO: Store more google info
            })

            if (!freshUser) {
              throw new Error('Failed creating user from google oauth2.')
            }

            // Return JWT token for auth (google ? or mines ?)
            const accessToken = await loginUser({
              email: freshUser.email,
              google_id: freshUser.id,
            })

            res.status(200).json(accessToken)
            return
          }

          const accessToken = await loginUser({
            email: userData.email,
            google_id: userData.id,
          })
          console.log(accessToken)

          res.status(200).json(accessToken)
        } catch (err) {
          next(err)
        }
      },
    ],
  },
  {
    path: '/auth/login',
    method: 'post',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const { title } = req.body

        try {
          res.status(200).json(title)
        } catch (err) {
          res.status(401).json({
            message: err.message,
          })
          next(err)
        }
      },
    ],
  }
]