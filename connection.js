const mongoose = require("mongoose");
const { DATABASE } = process.env;

const makeConnection = async (clientObj = {}) => {
    return await (async () => mongoose.connect(DATABASE))();
}

module.exports = makeConnection