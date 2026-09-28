const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { initDb, getDb } = require('./db/connect');

const app = express();
const port = process.env.PORT || 3000;

// Let Swagger use whatever host/protocol serves the docs (localhost or Render)
delete swaggerDocument.host;
delete swaggerDocument.schemes;

// Render runs behind a proxy; needed so secure cookies work over HTTPS
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

// Session configuration (stored in MongoDB so it survives Render restarts)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: process.env.DB_NAME,
      collectionName: 'sessions'
    }),
    cookie: {
      secure: 'auto',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth strategy: creates the user account on first login
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const now = new Date();
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        const avatarUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

        await getDb()
          .collection('users')
          .updateOne(
            { githubId: profile.id },
            {
              $set: {
                username: profile.username,
                displayName: profile.displayName || profile.username,
                email,
                avatarUrl,
                profileUrl: profile.profileUrl,
                lastLogin: now
              },
              $setOnInsert: {
                githubId: profile.id,
                createdAt: now
              }
            },
            { upsert: true }
          );

        console.log(`User logged in: ${profile.username}`);
        return done(null, profile);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', require('./routes'));

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

initDb()
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });