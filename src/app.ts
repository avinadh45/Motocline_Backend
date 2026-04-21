import express from "express"
import cors from "cors"
import userRouter from "./routes/user/userRouted"
import serviceCenterRouter from "./routes/serviceCenter/serviceCenterRoutes"
import mechanicRouter from "./routes/mechanic/mechanicRoutes"
import adminRouter from "./routes/admin/adminRoute"

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())

app.use("/",userRouter)
app.use("/service-center",serviceCenterRouter)
app.use("/mechanic", mechanicRouter)
app.use("/admin", adminRouter)

export default app