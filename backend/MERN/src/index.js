import dotenv from 'dotenv'
import connectDB from './db/index.js'

import {app} from './app.js'

dotenv.config()

connectDB()
.then(() => {
    app.on("error", (error) => console.log(error))
    app.listen(process.env.PORT || 8000, () => console.log(`server is running ${process.env.PORT}`))
})
.catch((e) => console.error(e))