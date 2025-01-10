import axios from 'axios';

const foodApi = axios.create({
	baseURL: 'https://food-service-backend-production.up.railway.app/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

foodApi.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

foodApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default foodApi;
