require('dotenv').config()

const pg = require('pg')
const redis = require('redis')
const logger = require('pino')()
const createApp = require('./app')
const makeAuthorize = require('./authorize')
const makePlacesComposition = require('../composition/places')
const makePlaceCategories = require('../composition/placecategories')
const makeQuestionsComposition = require('../composition/questions')
const makeQuestionCategoriesComposition = require('../composition/questioncategories')
const makeQuestionnairesComposition = require('../composition/questionnaires')
const makeAnswersComposition = require('../composition/answers')
const makeUsersComposition = require('../composition/users')
const makeLoginComposition = require('../composition/login')
const makeLogoutComposition = require('../composition/logout')
const makeStatementsComposition = require('../composition/statements')
const makeStatementQuestionsComposition = require('../composition/statementquestions')
const makeScoresComposition = require('../composition/scores')

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
})

const isProduction = process.env.NODE_ENV === 'production'

const app = createApp(isProduction, logger)
const authorize = makeAuthorize(redisClient, pgPool, logger)

app.use('/login', makeLoginComposition(pgPool, redisClient, isProduction))
// app.use(authorize())
app.use('/logout', makeLogoutComposition(redisClient))
app.use('/places', makePlacesComposition(pgPool, logger))
app.use('/placecategories', makePlaceCategories(pgPool))
app.use('/questions', makeQuestionsComposition(pgPool))
app.use('/questioncategories', makeQuestionCategoriesComposition(pgPool))
app.use('/questionnaires', makeQuestionnairesComposition(pgPool))
app.use('/answers', makeAnswersComposition(pgPool))
app.use('/users', makeUsersComposition(pgPool, redisClient))
app.use('/statements', makeStatementsComposition(pgPool))
app.use('/statementquestions', makeStatementQuestionsComposition(pgPool))
app.use('/scores', makeScoresComposition(pgPool))

app.get('/user', (req, res) => {
  if (req.user) {
    return res.json({
        name: req.user.name,
        username: req.user.username,
        isAdmin: req.user.isAdmin,
        isPlace: req.user.isPlace,
        isOrganization: req.user.isOrganization,
        placeId: req.user.placeId,
        placeName: req.user.placeName,              
        placeCategoryId: req.user.placeCategoryId,
        placeCategoryName: req.user.placeCategoryName,              
      })
  }

  return res.sendStatus(404)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  logger.info('server running on port ' + port)
})
