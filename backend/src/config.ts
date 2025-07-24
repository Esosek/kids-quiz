process.loadEnvFile()

const config = {
  db: {
    url: envOrThrow('DB_URL'),
    migrationConfig: {
      migrationsFolder: './src/db/migrations',
    },
  },
}

function envOrThrow(key: string) {
  const value = process.env[key]
  console.log(value)
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value
}

export default config
