const mongoose = require('mongoose');
const School = require('./School');
const ClassroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
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

ClassroomSchema.pre('save', async function (next) {
    const school = await School.findById(this.school);
    if (!school) {
        throw new Error('School does not exist');
    }
    next();
});


ClassroomSchema.pre('findByIdAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.school) {
        const school = await School.findById(update.school);
        if (!school) {
            throw new Error('School does not exist');
        }
    }
    next();
});

module.exports = mongoose.model('Classroom', ClassroomSchema);