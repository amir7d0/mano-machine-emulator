require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`service is running on port ${PORT}`)
})