import 'dotenv/config';
import connectDB from './db/db.js';
import app from './app.js';

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
    connectDB()
        .then(() => {
            console.log(`Server is running on port ${port}`)
        })
})