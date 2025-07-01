import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Email/Password, Step 2: API Key

  const handleNext = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email and password first
      await login(email, password, rememberMe);
      // If successful, move to API key step
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Here you would validate the API key
      // await validateApiKey(apiKey);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid API key. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-row-reverse bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: 'url(/login.png)'
      }}
    >
      <div className="w-1/2 flex items-center justify-center px-8 relative">
        {/* Purple overlay with blur effect */}
        <div 
          className="absolute inset-0 backdrop-blur-[40px]"
          style={{
            backgroundColor: 'rgba(105, 65, 198, 0.7)', // #6941C6 with 70% opacity
          }}
        />
        
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative z-10">
          <div className="flex justify-center mb-8">
            <img src="/cp-logo.png" alt="CloudPrinter" className="h-8" />
          </div>
          
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2"> Admin log in</h2>
          <p className="text-center text-gray-600 mb-8">Enter your account details.</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {step === 1 ? (
            <form onSubmit={handleNext}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember for 30 days
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-500">
                    Forgot password
                  </Link>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Next'}
                </button>

                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-purple-600 hover:text-purple-500 font-medium">
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Add Print-Partner API Key
                  </label>
                  <input
                    id="apiKey"
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="type or paste API key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}
          
          <p className="text-center text-sm text-gray-500 mt-8">
            ©2025 CloudPrinter.
          </p>
        </div>
      </div>
      <div className="w-1/2" />
    </div>
  );
} 