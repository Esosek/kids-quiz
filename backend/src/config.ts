const config = {
  db: {
    url: envOrThrow('DB_URL'),
    migrationConfig: {
      migrationsFolder: './src/db/migrations',
    },
  },
  jwt: {
    secret: envOrThrow('JWT_SECRET_KEY'),
    cookieName: 'kidsqz_l',
  },
  adminUserId: envOrThrow('ADMIN_USER_ID'),
}

function envOrThrow(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value
}

export default config
