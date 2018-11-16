const mongoose = require('mongoose');
const { Schema } = mongoose;

const fitnessInfo = new Schema({
    email: String,
    name: String,
    bmi: Number,
    weeklyExercise: Number,
    eatFastFood: Number
})

mongoose.model('fitness', fitnessInfo);