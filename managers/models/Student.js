const mongoose = require('mongoose');
const School = require('./School');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    program: {
        type: String
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


StudentSchema.pre('save', async function (next) {
    const school = await School.findById(this.school);
    if (!school) {
        throw new Error('School does not exist');
    }
    next();
});


StudentSchema.pre('findByIdAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.school) {
        const school = await School.findById(update.school);
        if (!school) {
            throw new Error('School does not exist');
        }
    }
    next();
});

module.exports = mongoose.model('Student', StudentSchema);