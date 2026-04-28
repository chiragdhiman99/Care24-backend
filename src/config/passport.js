const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5001/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails[0].value });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName,       
                        email: profile.emails[0].value,
                        password: "google_auth",
                        phone: "0000000000",             
                        role: "family",               
                        photo: profile.photos[0].value
                    });
                }else{
                    user.photo = profile.photos[0].value;
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        },
    ),
);

module.exports = passport;