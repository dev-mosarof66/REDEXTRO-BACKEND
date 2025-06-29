import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js';

const connectDB = async () => {

    try {

        const connInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)

        if (connInstance) {
            console.log(`mongodb connected at host : ${connInstance?.connection.host}`);

        }
    } catch (error) {
        console.log(`error while connecting to database: ${error}`);

    }
}


export default connectDB