import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(process.cwd(), '.env')});

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_js_salt_round: process.env.BCRYPT_JS_SALT_ROUND,
    cloudinary: {
        cloudinary_api_name: process.env.CLOUDINARY_API_NAME as string,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY as string,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET as string,
    },
};
