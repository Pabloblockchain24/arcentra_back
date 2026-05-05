import app from "./src/app.js"
import serverless from "serverless-http";
import config from "./src/config/config.js"

app.listen(config.port, () => console.log(`🚀 Server running on port ${config.port}`))

import { connectDB } from "./src/db.js"
connectDB()

export default serverless(app);