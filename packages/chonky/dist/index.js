
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./chonky.cjs.production.min.js')
} else {
  module.exports = require('./chonky.cjs.development.js')
}
