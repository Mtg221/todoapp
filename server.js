require("dotenv").config();
const express     = require("express");
const bcrypt      = require("bcrypt");
const jwt         = require("jsonwebtoken");
const cors        = require("cors");
const helmet      = require("helmet");
const rateLimit   = require("express-rate-limit");
const verifyToken = require("./middleware/verifyToken");

const db           = require("./db/db");
const { users, todos } = require("./db/schema");
const { eq }       = require("drizzle-orm");

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET manquant dans .env");

const app = express();

app.use(helmet());

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",").map(s => s.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("CORS non autorisé"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "500kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Trop de tentatives, réessayez dans 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/register", authLimiter, async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email))
    return res.status(400).json({ error: "Email invalide" });
  if (!password || password.length < 8)
    return res.status(400).json({ error: "Mot de passe trop court (8 caractères min)" });

  try {
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0)
      return res.status(400).json({ error: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 12);
    await db.insert(users).values({ email, password: hashedPassword });
    res.status(201).json({ message: "Compte créé" });
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email et mot de passe requis" });

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Identifiants incorrects" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ token });
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/todos", verifyToken, async (req, res) => {
  try {
    const userTodos = await db.select().from(todos).where(eq(todos.userId, req.user.userId));
    res.json(userTodos);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
