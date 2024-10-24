const mongoose = require('mongoose');

async function main() {
    const url = process.env.mongoUrl
    try {
        await mongoose.connect(url)
        console.log('Mongo Connected Successfully');
    } catch (error) {
        console.log(error);
    }
}

module.exports = { main }