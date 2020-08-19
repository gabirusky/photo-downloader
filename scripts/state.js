const fs = require('fs')
const userinfoFilePath = './userinfo.json'

function save(userinfo) {
    const userinfoString = JSON.stringify(userinfo)
    return fs.writeFileSync(userinfoFilePath, userinfoString)
}

function load() {
    const fileBuffer = fs.readFileSync(userinfoFilePath, 'utf-8')
    const userinfoJson = JSON.parse(fileBuffer)
    return userinfoJson
}

function deleteJson() {
    return fs.unlink(userinfoFilePath, (err) => {
        if (err) throw err;
        console.log('> userinfo.json was deleted');
    });
}

module.exports = {
    save,
    load,
    deleteJson
}