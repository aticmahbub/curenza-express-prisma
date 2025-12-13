import {OpenRouter} from '@openrouter/sdk';
import config from '../config';

export const openRouter = new OpenRouter({
    apiKey: config.open_router.open_router_api_key,
});
