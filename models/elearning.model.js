const mongoose = require('mongoose');

const Elearning = mongoose.model(
    "Elearning",
    new mongoose.Schema({
        name: String,
        video: String,
        id: Number
    })
);

module.export = Elearning;