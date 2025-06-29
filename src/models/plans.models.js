import mongoose from 'mongoose'


const planSchema = new mongoose.Schema({
    category: {
        type: String,
        default: "No Category"
    },
    planTitle: {
        type: String,
        required: true,
        trim: true
    },
    startingDate: {
        type: String,
        required: true
    },
    startingTime: {
        type: String,
        required: true
    },
    repeatation: {
        type: [String],
        default: ['No Repeat']
    },
    Notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'new'
    },
    reminderTime: {
        type: Date,
        default: null
    },
    reminderType: {
        type: String,
        default: ''
    },
    duration: {
        type: Object,
        default: {
            hours: 0,
            minutes: 0
        }
    }
}, {
    timestamps: true
});

const Plan = mongoose.model('Plan', planSchema)

export default Plan;