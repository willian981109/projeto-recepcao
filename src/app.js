const express = require("express");
const cors = require("cors");

const app = express();

// 🔴 ISSO É O MAIS IMPORTANTE
app.use(cors());
app.use(express.json());

// rotas
const eventsRoutes = require("./routes/events.routes");
const guestsRoutes = require("./routes/guests.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/events", eventsRoutes);
app.use("/guests", guestsRoutes);
app.use("/auth", authRoutes);

// health
app.get("/health", (req, res) => {
  res.json({ status: "API Recepção Digital rodando 🚀" });
});

module.exports = app;

