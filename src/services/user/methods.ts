import User from '../../models/user'

export const getAllUsers = async () => {
  const users = await new User().fetchAll()

  return users
}

export type CreateUserPayload = { password?: string, email: string, name: string, google_id?: string }
export const createUser = async (args: CreateUserPayload) => {
  try {
    return await new User(args).save()
  } catch (err) {
    throw new Error(err)
  }
}

export const getUserByID = async (id: string) => {
  const user = await User.where<User>({ id }).fetch()
  return user
}

export const getUserByEmail = async (email: string) => {
  const user = await User.where<User>({ email }).fetch()
  return user
}

export const getUserByGoogleID = async (google_id: string) => {
  try {
    const user = await User.where<User>({ google_id }).fetch()
    return user
  } catch (err) {
    return null
  }
}