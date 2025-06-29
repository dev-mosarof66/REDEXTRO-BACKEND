import Plan from '../models/plans.models.js';
import User from '../models/user.models.js';

export const createPlan = async (req, res) => {
    try {
        const userId = req?.user;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(402).json({ message: 'User not found.' });
        }
        const {
            planTitle,
            category,
            startingDate,
            startingTime,
            repeatation,
            Notes,
            status,
            reminderType,
            reminderTime,
            duration


        } = req.body;
        console.log(req.body)


        if (!planTitle || !startingDate || !startingTime) {
            return res.status(402).json({ message: 'planTitle, startingDate, and startingTime are required.' });
        }
        // console.log(req.body);
        console.log(userId)




        const newPlan = new Plan({
            category,
            planTitle,
            startingDate,
            startingTime,
            repeatation,
            Notes,
            status,
            reminderType,
            reminderTime,
            duration
        });



        user.plans.push(newPlan?._id)
        await user.save()
        const savedPlan = await newPlan.save();
        res.status(201).json({
            message: "Plan created successfully",
            plan: savedPlan
        });
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({ message: 'Server error while creating plan.' });
    }
};



export const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.json(plan);
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ message: 'Server error while fetching plan.' });
    }
};

export const updatePlan = async (req, res) => {

    try {
        const userId = req.user
        const user = await User.findById(userId)

        if(!user){
            return res.status(401).json({message: 'User does not exist'})
        }

        const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedPlan) return res.status(402).json({ message: 'Plan not found' });

        res.json(updatedPlan);
    } catch (error) {
        console.error('Error updating plan:', error);
        res.status(500).json({ message: 'Server error while updating plan.' });
    }
};

export const deletePlan = async (req, res) => {
    try {
        const userId = req?.user;
        const user = await User.findById(userId);
        // console.log('user in delete controller', user)

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const planId = req.params.id;
        // console.log(planId)
        // console.log('length of user plans array before : ', user.plans.length)

        const index = user.plans.findIndex((plan) => plan._id.toString() === planId);
        // console.log(index)


        if (index === -1) {
            return res.status(402).json({ message: 'Plan not found' });
        }



        const updatedPlansArray = user.plans.filter((plan) => plan._id != planId)
        // console.log(updatedPlansArray)
        // console.log('updatedPlansArray length', updatedPlansArray.length)


        const plan = await Plan.findByIdAndDelete(planId);
        if (!plan) {
            return res.status(402).json({ message: 'Plan not found' });
        }

        user.plans = updatedPlansArray;

        user.save({
            validateBeforeSave: false
        })


        res.json({ message: 'Plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(500).json({ message: 'Server error while deleting plan.',error });
    }
};

