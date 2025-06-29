import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    plans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    }],
    profilepic: {
        type: String,
        default: ''
    },
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ],
    token:{
        type: Number,
        default: ''
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateJWT = function () {
    const payload = { id: this._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', {
        expiresIn: '1d'
    });
    return token;
};

const User = mongoose.model('User', UserSchema);
export default User