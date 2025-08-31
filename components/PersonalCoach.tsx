
import React, { useState, useCallback } from 'react';
import { generatePersonalizedPlan } from '../services/apiService';
import type { UserMetrics, PersonalizedPlan } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import Input from './common/Input';
import Select from './common/Select';
import PlanDisplay from './PlanDisplay';

const PersonalCoach: React.FC = () => {
  const [metrics, setMetrics] = useState<UserMetrics>({
    height: '', weight: '', age: '', gender: '', activityLevel: ''
  });
  const [goal, setGoal] = useState<string>('');
  const [plan, setPlan] = useState<PersonalizedPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setMetrics({ ...metrics, [e.target.name]: e.target.value });
  };
  
  const isFormValid = () => {
      return Object.values(metrics).every(val => val !== '') && goal.trim() !== '';
  }

  const handleGeneratePlan = useCallback(async () => {
    if(!isFormValid()) {
        setError("Please fill in all fields before generating a plan.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const result = await generatePersonalizedPlan(metrics, goal);
      setPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [metrics, goal]);

  return (
    <Card>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Personal AI Coach</h2>
        <p className="text-gray-600 mb-6">Enter your details and goals to receive a customized plan.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Height (e.g., 180cm or 5ft 11in)" name="height" value={metrics.height} onChange={handleChange} placeholder="Your height" />
          <Input label="Weight (e.g., 75kg or 165lbs)" name="weight" value={metrics.weight} onChange={handleChange} placeholder="Your weight" />
          <Input label="Age" name="age" type="number" value={metrics.age} onChange={handleChange} placeholder="Your age" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Gender" name="gender" value={metrics.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </Select>
            <Select label="Activity Level" name="activityLevel" value={metrics.activityLevel} onChange={handleChange}>
                <option value="">Select Activity Level</option>
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
                <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                <option value="active">Very active (hard exercise/sports 6-7 days a week)</option>
                <option value="very_active">Extra active (very hard exercise/sports & physical job)</option>
            </Select>
        </div>
        <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Your Goal</label>
            <textarea
                id="goal"
                name="goal"
                rows={3}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="e.g., 'Lose 10 pounds in 2 months', 'Gain muscle mass', '跑得更快'"
            />
             <p className="mt-1 text-xs text-gray-500">Describe your fitness goal in any language.</p>
        </div>
      </div>
      
      <div className="mt-6 text-center">
         <Button onClick={handleGeneratePlan} disabled={!isFormValid() || isLoading} className="w-full sm:w-auto">
            {isLoading ? <Spinner /> : 'Generate My Plan'}
        </Button>
      </div>

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {plan && <PlanDisplay plan={plan} />}
    </Card>
  );
};

export default PersonalCoach;
