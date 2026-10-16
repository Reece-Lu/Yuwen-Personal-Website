import { get } from '../utils/api-utils';

// Fetch the latest snapshot of services running on the server
export const fetchRunningServices = async () => {
    try {
        const data = await get('/serverstatus/services', {}, 'springBoot');
        return data;
    } catch (error) {
        console.error('Error fetching running services:', error);
        throw error;
    }
};
