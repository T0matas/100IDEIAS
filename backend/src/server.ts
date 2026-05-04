import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import communityRoutes from "./routes/community";
import ideasRoutes from "./routes/ideas";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/ideas", ideasRoutes);

app.get("/", (req, res) => {
  res.send("100Ideias API is running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`🚀 Server fully active on port ${port}`);
});
