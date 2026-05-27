import { get } from '../utils/api-utils';

// Fetch VM status for the past 3 days
export const fetchLast3DaysVmStatus = async () => {
    try {
        const data = await get('/vmstatus/last3days', {}, 'springBoot');
        return data;
    } catch (error) {
        console.error('Error fetching VM status for the last 30 days:', error);
        throw error;
    }
};
