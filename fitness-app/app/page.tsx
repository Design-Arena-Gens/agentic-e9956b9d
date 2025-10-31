'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'fitness' | 'nutrition'>('fitness');
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    goal: '',
    activityLevel: '',
    dietaryPreferences: '',
    allergies: '',
    healthConditions: ''
  });
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: activeTab })
      });

      const data = await res.json();
      setResponse(data.advice);
    } catch (error) {
      setResponse('Error getting consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            AI Fitness & Nutrition Consultant
          </h1>
          <p className="text-gray-600 text-lg">
            Get personalized fitness and nutrition advice powered by AI
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-lg p-1 inline-flex">
            <button
              onClick={() => setActiveTab('fitness')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                activeTab === 'fitness'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏋️ Fitness
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                activeTab === 'nutrition'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🥗 Nutrition
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {activeTab === 'fitness' ? 'Fitness Consultation' : 'Nutrition Consultation'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal
                </label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a goal</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="endurance">Endurance</option>
                  <option value="general-health">General Health</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light Activity</option>
                  <option value="moderate">Moderate Activity</option>
                  <option value="active">Very Active</option>
                  <option value="athlete">Athlete</option>
                </select>
              </div>

              {activeTab === 'nutrition' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Preferences
                    </label>
                    <input
                      type="text"
                      value={formData.dietaryPreferences}
                      onChange={(e) => setFormData({ ...formData, dietaryPreferences: e.target.value })}
                      placeholder="e.g., vegetarian, vegan, keto"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <input
                      type="text"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="e.g., nuts, dairy, gluten"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Conditions
                </label>
                <textarea
                  value={formData.healthConditions}
                  onChange={(e) => setFormData({ ...formData, healthConditions: e.target.value })}
                  placeholder="Any health conditions we should know about?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : activeTab === 'fitness'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? 'Generating Advice...' : 'Get AI Consultation'}
              </button>
            </form>
          </div>

          {/* Response Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Personalized Plan</h2>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
            ) : response ? (
              <div className="prose prose-sm max-w-none">
                <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                    {response}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-6xl mb-4">
                  {activeTab === 'fitness' ? '💪' : '🥗'}
                </div>
                <p className="text-gray-500 text-lg">
                  Fill out the form to receive your personalized
                  <br />
                  {activeTab === 'fitness' ? 'fitness' : 'nutrition'} consultation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-bold text-xl mb-2">Personalized Plans</h3>
            <p className="text-gray-600">
              AI-powered recommendations tailored to your unique goals and lifestyle
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-bold text-xl mb-2">Data-Driven</h3>
            <p className="text-gray-600">
              Evidence-based advice using latest fitness and nutrition science
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-bold text-xl mb-2">Instant Results</h3>
            <p className="text-gray-600">
              Get your customized plan in seconds, available 24/7
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
