const path = require('path')

module.exports = path.dirname(require.main.filename) // still refer to original main module even it changes at runtime

// alternative
// path.dirname(process.mainModule...) // will be undefined if there is no entry script
