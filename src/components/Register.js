import './Auth.css';

import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import authApi from '../api/authAxios';
import { useAuth } from '../context/AuthContext';

const Register = ({ onClose, onSwitchToLogin }) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		if (!username || !email || !password) {
			setError('All fields are required');
			setIsLoading(false);
			return;
		}

		if (!/\S+@\S+\.\S+/.test(email)) {
			setError('Please enter a valid email address');
			setIsLoading(false);
			return;
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters long');
			setIsLoading(false);
			return;
		}

		try {
			const response = await authApi.post('/auth/register', {
				username,
				email,
				password,
			});

			const { token, user } = response.data;
			login(user, token);
			onClose();
		} catch (err) {
			if (err.response) {
				switch (err.response.status) {
					case 400:
						setError(err.response.data.message || 'Please check your input');
						break;
					case 409:
						setError('Email already exists. Please use a different email.');
						break;
					case 422:
						setError('Invalid input. Please check your details.');
						break;
					case 500:
						setError('Server error. Please try again later.');
						break;
					default:
						setError('Registration failed. Please try again.');
				}
			} else if (err.request) {
				setError('Unable to connect to the server. Please check your internet connection.');
			} else {
				setError('An unexpected error occurred. Please try again.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-white rounded-lg p-8 w-full max-w-md relative'>
				<button onClick={onClose} className='absolute right-4 top-4 hover:text-gray-600 transition-colors'>
					<X className='w-6 h-6 text-gray-400' />
				</button>

				<h2 className='text-2xl font-semibold text-center mb-6'>Create Account</h2>

				{error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm'>{error}</div>}

				<form className='space-y-6' onSubmit={handleSubmit}>
					<div>
						<input
							type='text'
							placeholder='Username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className='w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-200'
							disabled={isLoading}
							required
						/>
					</div>

					<div>
						<input
							type='email'
							placeholder='Email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-200'
							disabled={isLoading}
							required
						/>
					</div>

					<div className='relative'>
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder='Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-200'
							disabled={isLoading}
							required
							minLength={6}
						/>
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
							disabled={isLoading}>
							{showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
						</button>
					</div>

					<button
						type='submit'
						className={`w-full p-3 bg-rose-200 text-white rounded-lg transition-colors ${
							isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-rose-300'
						}`}
						disabled={isLoading}>
						{isLoading ? 'Registering...' : 'Register'}
					</button>
				</form>

				<p className='text-center mt-6 text-sm text-gray-600'>
					Already have an account?{' '}
					<button
						onClick={onSwitchToLogin}
						className='text-rose-300 hover:text-rose-400 transition-colors'
						disabled={isLoading}>
						Login
					</button>
				</p>
			</div>
		</div>
	);
};

export default Register;
