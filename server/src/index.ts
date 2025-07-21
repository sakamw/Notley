import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import entryRoutes from "./routes/entry.routes";
import errorHandler from "./middlewares/errorHandler";

const app: Express = express();

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://s5kw9q5f-5173.uks1.devtunnels.ms",
    ],
    credentials: true,
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
  })
);

app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);
app.use(errorHandler);

app.get("/", (_req, res) => {
  res.send("<h1>Welcome to Notely</h1>");
});

const port = process.env.PORT || 4800;
console.log(`App running on port ${port}`);
app.listen(port);
