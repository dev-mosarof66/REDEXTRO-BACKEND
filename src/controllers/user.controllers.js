import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import Notification from '../models/notification.models.js';
import sendMail from '../utils/sendMail.js';
import bcrypt, { compare } from 'bcrypt'


export const signup = async (req, res) => {
    try {
        console.log('inside signup controller')
        const { email, username, password, profilepic } = req.body;
        console.log(req.body)

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const code = await sendMail(email, username)
        console.log(code)

        if (!code) {
            return res.status(500).json({ message: 'Failed to send mail' });
        }
        const encryptedCode = await bcrypt.hash(code, 10)
        console.log(encryptedCode)

        res.cookie("auth", encryptedCode)


        res.status(201).json(
            {
                message: "Verification email sent successfully",
                user: {
                    email,
                    username,
                    password,
                    profilepic
                }
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};


export const verifyEmail = async (req, res) => {
    try {
        console.log("inside verify email")
        const auth = req.cookies.auth;
        console.log('atuth',auth)

        if (!auth) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        const { email, username, password, profilepic, code } = req.body;
        console.log('req',req?.body)

        if (!code) {
            return res.status(401).json({ message: 'Invalid verification code' });
        }

        const compareCode = await bcrypt.compare(code, auth);
        console.log(compareCode)

        if (!compareCode) {
            return res.status(401).json({ message: 'Invalid verification code' });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already verified' });
        }

        const newUser = new User({ email, username, password, profilepic });
        await newUser.save();

        res.status(201).json({ message: 'Email verified and user registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Invalid or expired token', error: error.message });
    }
};



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not registered' });
        }

        console.log(user)

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = user.generateJWT();


        res.cookie('authorization', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 365 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ user: { id: user._id, email: user.email, username: user.username, profilepic: user.profilepic } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

export const logout = async (req, res) => {

    try {
        const id = req.user;
        const user = await User.findById(id);
        // console.log(user)

        if (!user) {
            return res.status(401).json({ message: 'User does not exist' });
        }
        res.cookie('authorization', null);


        res.status(200).json({
            message: "Logout Success",
        })



    } catch (error) {
        console.log('server error in logout', error);
        res.status(500).json({
            message: 'Internal Server Error.',
        })

    }
};


export const editProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, profilepic } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (profilepic) user.profilepic = profilepic;

        await user.save();

        res.status(200).json({ user: { id: user._id, email: user.email, username: user.username, profilepic: user.profilepic } });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

export const getAllPlans = async (req, res) => {
    try {
        const userId = req.user;


        const user = await User.findById(userId).populate('plans');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ plans: user.plans });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching plans', error: error.message });
    }
};


export const getProfile = async (req, res) => {
    try {
        const userId = req.user;

        const user = await User.findById(userId).select('-password -plans')

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(201).json({
            user
        })


    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
}


export const getAllNotification = async (req, res) => {


    try {
        console.log("in get all notification controller")
        const userId = req.user;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        const notifications = user?.notifications
        let notificationsArray = []
        if (notifications.length > 0) {
            for (let i = 0; i < notifications.length; i++) {
                const notification = await Notification.findById(notifications[i]._id)
                notificationsArray.push(notification)
            }
        }
        res.status(200).json({ notifications: notificationsArray });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
        console.log('error in fetching notification', error)
    }
}

export const pushNotification = async (req, res) => {
    try {
        console.log("in pushing notification controller")

        const userId = req?.user

        const user = await User.findById(userId)

        if (!user) {
            return res.status(402).json({ message: 'User not found' });
        }

        const { title, body } = req.body;
        console.log(req?.body)

        if (!title) {
            return res.status(405).json({ message: 'Invalid notification' });
        }
        if (!body) {
            return res.status(405).json({ message: 'Invalid notification' });
        }

        const notification = new Notification({
            title,
            body
        })

        if (!notification) {
            return res.status(405).json({ message: 'Invalid notification' });
        }

        user.notifications.push(notification?._id)



        await notification.save({
            validateBeforeSave: false
        })
        await user.save({
            validateModifiedOnly: true
        })

        res.status(201).json({
            message: 'Notification created',
            notification
        })


    } catch (error) {
        res.status(500).json({ message: 'Error pushing notification', error: error.message });
        console.log('error while pushing notification in the server', error)
    }
}
