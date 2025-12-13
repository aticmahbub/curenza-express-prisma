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
    jwt: {
        jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
        jwt_access_expires: process.env.JWT_ACCESS_EXPIRES as string,
        jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
        jwt_refresh_expires: process.env.JWT_REFRESH_EXPIRES as string,
    },
    open_router: {
        open_router_api_key: process.env.OPEN_ROUTER_API_KEY as string,
    },
};
