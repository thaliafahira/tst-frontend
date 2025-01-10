import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import foodApi from '../api/foodAxios';

const FoodSection = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      if (token) {
        loadFoods();
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const loadFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await foodApi.get('/foods');
      setFoods(response.data);
    } catch (err) {
      console.error('Load foods error:', err);
      setError('Failed to load food items. Please try again.');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await foodApi.post('/foods', newFood);
      setSuccessMessage(`Successfully added ${response.data.name} to the menu!`);
      setNewFood({
        name: '',
        description: '',
        price: '',
        category: ''
      });
      
      loadFoods();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      if (err.response?.status === 401) {
        setError('Please log in again to continue.');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        setError(err.response?.data?.message || 'Failed to add food item. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <p>Please login to manage food items.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Food Item</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert className="mb-4">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newFood.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newFood.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={newFood.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={newFood.category}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a category</option>
              <option value="appetizer">Appetizer</option>
              <option value="main">Main Course</option>
              <option value="dessert">Dessert</option>
              <option value="beverage">Beverage</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Food Item
              </>
            )}
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Current Menu Items</h3>
          <div className="space-y-4">
            {foods.map((food) => (
              <div key={food._id} className="p-4 border rounded-md">
                <h4 className="font-medium">{food.name}</h4>
                <p className="text-sm text-gray-600">{food.description}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm font-medium">${food.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 capitalize">{food.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodSection;