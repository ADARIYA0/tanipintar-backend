require('dotenv').config()

const { connectRedis } = require('./src/utils/tokenBlacklist')
const { pool, connectToDatabase } = require('./src/config/db')
const { initMQTT } = require('./src/services/mqttClient')
const app = require('./app')
const logger = require('./src/utils/logger')

const PORT = process.env.PORT || 4000

const startServer = async () => {
  await connectToDatabase()
  await connectRedis()
  await require('./src/services/mqttClient')

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`HTTP Server running at http://0.0.0.0:${PORT}`)
  })


  await initMQTT()

  const shutdown = () => {
    logger.info('Shutting down gracefully...')
    server.close(() => {
      logger.info('HTTP server closed')
      pool.end()
        .then(() => {
          logger.info('Database pool has ended')
          setTimeout(() => process.exit(0), 200)
        })
        .catch((err) => {
          logger.error(`Error closing DB pool: ${err}`)
          setTimeout(() => process.exit(1), 200)
        })
    })
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

startServer()
