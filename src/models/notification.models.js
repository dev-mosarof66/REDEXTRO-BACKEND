import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
