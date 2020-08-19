const readline = require('readline-sync')
const state = require('./state.js')


function download() {
  const userinfo = {}
  
  userinfo.username = askAndReturnUsername()
  state.save(userinfo)

  function askAndReturnUsername() {
    return readline.question('Type an instagram username: ')
  }

}

module.exports = download
