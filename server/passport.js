const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

//stores the user in the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//finds the stored id from the database
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user)
        });
});

//proxy: true allows for the relative path to be used
passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, 
        async (accessToken, refreshToken, profile, done) => {
            const existing = await User.findOne({ googleId: profile.id })
            if(existing){
                //already have a record with id
                return done(null, existing);
            }
            //if new user save to the database
            const user = await new User({ googleId: profile.id }).save();
            done(null, user);
        }
    )
);