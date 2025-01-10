import './App.css';

import React, { useState, useEffect } from 'react';
import slide1 from './assets/Slide1.jpg';
import slide2 from './assets/Slide2.jpg';
import slide3 from './assets/Slide3.jpg';
import logo from './assets/LogoA.png';
import Login from './components/Login';
import Register from './components/Register';
import FoodSection from './components/FoodSection';
import { AuthProvider, useAuth } from './context/AuthContext';
import foodApi from './api/foodAxios';

const AppContent = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [theme, setTheme] = useState('classic');
	const [details, setDetails] = useState('');
	const [additionalInfo, setAdditionalInfo] = useState('');
	const [imageURL, setImageURL] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const slides = [slide1, slide2, slide3];
	const { user, logout } = useAuth();

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [slides.length]);

	const handleGenerate = async () => {
		setLoading(true);
		setError('');
		setImageURL('');

		try {
			const response = await foodApi.post('/invitations/generate', { theme, details, additionalInfo });
			setImageURL(response.data.imageUrl);
		} catch (err) {
			console.error(err);
			setError('Unexpected error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleCopyLink = () => {
		if (imageURL) {
			navigator.clipboard.writeText(imageURL);
			alert('Link copied to clipboard!');
		}
	};

	return (
		<div className='w-full'>
			<nav className='w-full px-8 py-4 flex items-center justify-between border-b border-pink-100'>
				<div className='flex items-center'>
					<div className='bg-pink-50 rounded-full p-3'>
						<img src={logo} alt='Logo' className='h-10' />
					</div>
				</div>

				<div className='flex-1 mx-12'>
					<div className='relative'>
						<input
							type='text'
							placeholder='Search'
							className='w-full bg-gray-50 rounded-xl py-3 px-12 focus:outline-none text-gray-400 text-lg'
							aria-label='Search'
						/>
					</div>
				</div>

				<div className='flex gap-4 items-center'>
					{!user ? (
						<>
							<button
								onClick={() => setShowLogin(true)}
								className='px-8 py-2.5 text-rose-300 border border-rose-300 rounded-lg hover:bg-rose-50 transition-colors text-lg font-light'>
								Login
							</button>
							<button
								onClick={() => setShowRegister(true)}
								className='px-8 py-2.5 bg-rose-200 text-white rounded-lg hover:bg-rose-300 transition-colors text-lg font-light'>
								Register
							</button>
						</>
					) : (
						<>
							<span className='text-gray-600'>Welcome!</span>
							<button
								onClick={logout}
								className='px-8 py-2.5 bg-rose-200 text-white rounded-lg hover:bg-rose-300 transition-colors text-lg font-light'>
								Logout
							</button>
						</>
					)}
				</div>
			</nav>

			{/* Rest of your components */}
			<div className='carousel-container overflow-hidden relative'>
				<div className='slides' style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
					{slides.map((slide, index) => (
						<div className='slide' key={index}>
							<img src={slide} alt={`Slide ${index + 1}`} className='carousel-image' />
						</div>
					))}
				</div>
			</div>

			<div className='content-grid'>
				<div className='option-card'>
					<h3>Choose food</h3>
					<FoodSection />
				</div>
			</div>

			<div className='px-8 py-12'>
				<h2 className='text-2xl font-light text-rose-400 mb-6'>Customize Wedding Invitation</h2>
				<div className='space-y-6'>
					<div>
						<label htmlFor='theme' className='block text-gray-600 mb-2'>
							Choose Theme
						</label>
						<select
							id='theme'
							value={theme}
							onChange={(e) => setTheme(e.target.value)}
							className='w-full py-3 px-4 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring focus:ring-rose-200'>
							<option value='classic'>Classic</option>
							<option value='modern'>Modern</option>
							<option value='bohemian'>Bohemian</option>
						</select>
					</div>
					<div>
						<label htmlFor='details' className='block text-gray-600 mb-2'>
							Enter Details
						</label>
						<input
							type='text'
							id='details'
							value={details}
							onChange={(e) => setDetails(e.target.value)}
							placeholder='E.g., Names, Date, Venue'
							className='w-full py-3 px-4 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring focus:ring-rose-200'
						/>
					</div>
					<div>
						<label htmlFor='additional-info' className='block text-gray-600 mb-2'>
							Additional Info
						</label>
						<input
							type='text'
							id='additional-info'
							value={additionalInfo}
							onChange={(e) => setAdditionalInfo(e.target.value)}
							placeholder='E.g., Dress Code, RSVP'
							className='w-full py-3 px-4 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring focus:ring-rose-200'
						/>
					</div>
					<button
						onClick={handleGenerate}
						className='w-full py-3 bg-rose-300 text-white rounded-lg hover:bg-rose-400 transition-colors'
						disabled={loading}>
						{loading ? 'Generating...' : 'Generate'}
					</button>
				</div>

				<div className='mt-12 w-full h-64 bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400'>
					{imageURL ? (
						<img src={imageURL} alt='Generated Invitation' className='rounded-lg' />
					) : (
						error || 'Invitation Preview'
					)}
				</div>

				<button
					className='mt-6 w-full py-3 bg-rose-300 text-white rounded-lg hover:bg-rose-400 transition-colors'
					onClick={handleCopyLink}
					disabled={!imageURL}>
					Copy Link
				</button>
			</div>

			{showLogin && (
				<Login
					onClose={() => setShowLogin(false)}
					onSwitchToRegister={() => {
						setShowLogin(false);
						setShowRegister(true);
					}}
				/>
			)}

			{showRegister && (
				<Register
					onClose={() => setShowRegister(false)}
					onSwitchToLogin={() => {
						setShowRegister(false);
						setShowLogin(true);
					}}
				/>
			)}
		</div>
	);
};

const App = () => {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
};

export default App;
