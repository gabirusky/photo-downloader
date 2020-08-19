const app = {
    input: require('./scripts/input.js'),
    download: require('./scripts/download.js'),
}

async function start() {
    app.input();
    await app.download()
}

start();