import axios from 'axios';

const authAxios = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

authAxios.interceptors.request.use(
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

authAxios.interceptors.response.use(
	(response) => {
		console.log('Auth Response:', response);
		return response;
	},
	(error) => {
		console.error('Auth Response Error:', error.response || error);
		return Promise.reject(error);
	}
);

export const register = async (userData) => {
	try {
		const response = await authAxios.post('/auth/register', userData);
		return response.data;
	} catch (error) {
		throw error.response?.data || error.message;
	}
};

export const login = async (credentials) => {
	try {
		const response = await authAxios.post('/auth/login', credentials);
		return response.data;
	} catch (error) {
		throw error.response?.data || error.message;
	}
};

export default authAxios;
