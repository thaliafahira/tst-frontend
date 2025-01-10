import { AxiosError } from 'axios';
import foodApi from '../api/foodAxios';

const handleError = (error, context) => {
	if (error instanceof AxiosError) {
		console.error(`Failed to ${context}:`, error.response?.data || error.message);
	} else {
		console.error(`Failed to ${context}:`, error);
	}

	throw error;
};

export const foodService = {
	getMenuItems: async () => {
		try {
			const { data } = await foodApi.get('/foods');
			return data;
		} catch (error) {
			handleError(error, 'fetch menu items');
		}
	},

	saveSelections: async (selections) => {
		try {
			const { data } = await foodApi.post('/selections', selections);
			return data;
		} catch (error) {
			handleError(error, 'save selections');
		}
	},

	getSelections: async () => {
		try {
			const { data } = await foodApi.get('/selections');
			return data;
		} catch (error) {
			handleError(error, 'get selections');
		}
	},
};

export default foodService;
