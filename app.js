require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const connectDB = require('./server/config/db');

// Route imports
const indexRoutes = require('./server/routes/index');
const dashboardRoutes = require('./server/routes/dashboard');
const authRoutes = require('./server/routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static('public'));

// View engine setup
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', indexRoutes);
app.use('/', dashboardRoutes);
app.use('/', authRoutes);

// 404 handler
app.get('*', (req, res) => {
    res.status(404).render('404');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

module.exports = app;