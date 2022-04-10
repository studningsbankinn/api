function corsOrigin (isProduction) {
  console.log('isProduction', isProduction)
  const whitelist = []

  const productionList = [
    'https://admin.studningsbankinn.is',
    'https://www.studningsbankinn.is',
    'https://studningsbankinn.is',
    'https://sif.studningsbankinn.is',
    'https://neminn.is'
  ]

  const developmentList = [
    'http://local.studningsbankinn.is:3000',
    'http://local.studningsbankinn.is:3010'
  ]

  if (isProduction) {
    whitelist.push(...productionList)
  } else {
    whitelist.push(...developmentList)
  }

  return function (origin, cb) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed'))
    }
  }
}

module.exports = corsOrigin
