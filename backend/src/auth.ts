import bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(
      password,
      10,
      (err: any, hash: string | PromiseLike<string>) => {
        if (err) {
          reject(new Error('Failed to hash password'))
        }
        resolve(hash)
      }
    )
  })
}

export function createJWT() {
  // TODO: Implement createJWT
}

export function validateJWT() {
  // TODO: Implement validateJWT
}
