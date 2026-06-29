# Todo App — Application de tâches fullstack

Application de gestion de tâches avec authentification JWT, backend Express et base de données SQLite.

**Stack :** React + Vite | Node.js + Express | SQLite + Drizzle ORM | JWT Auth

---

## Structure du projet

```
todoapp/
├── POST/           ← Routes auth (login, register)
├── middleware/     ← Vérification JWT
├── src/
│   └── pages/     ← Dashboard, Login, Register
├── schema.js       ← Schéma Drizzle ORM
├── db.js           ← Connexion SQLite
└── server.js
```

---

## Démarrage rapide

```bash
npm install
```

**`.env`**
```env
JWT_SECRET=your_secret
PORT=3000
```

```bash
# Lancer le serveur
node server.js

# Lancer le frontend (dans un autre terminal)
npm run dev
```

---

## API

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/register` | ❌ | Créer un compte |
| POST | `/login` | ❌ | Connexion |
| GET | `/dashboard` | ✅ | Tâches de l'utilisateur |

---

## License

MIT
