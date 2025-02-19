import mongoes from 'mongoose';
import { MONGO_URI } from './../config/index';

export default async () => {
    try {
        await mongoes.connect(MONGO_URI);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
