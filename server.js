const { createServer } = require('http');
const app = require("./app");
require("./Routes")();
const makeConnection = require("./connection");

const server = createServer(app);

const PORT = process.env.PORT || 3001;

// Start the server
server.listen(PORT, async () => {
    try {
        await makeConnection();
        console.log(`Server is running on 🐣http://localhost:${PORT}`);  
        console.log("DB connected 🚀 "); 
    } catch (error) {
        console.log(`Server is not running => ${error.message}`);
    }
});
