import React, { useState } from 'react';

const GoalSetting = () => {
  const [goal, setGoal] = useState('');
  const [goalsList, setGoalsList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isManager, setIsManager] = useState(false); // Toggle for manager view

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (goal) {
      setGoalsList([...goalsList, { text: goal, completed: false }]);
      setGoal('');
    }
  };

  const handleToggleCompletion = (index) => {
    const updatedGoals = [...goalsList];
    updatedGoals[index].completed = !updatedGoals[index].completed;
    setGoalsList(updatedGoals);
    updateProgress(updatedGoals);
  };

  const updateProgress = (goals) => {
    const completedGoals = goals.filter(g => g.completed).length;
    setProgress((completedGoals / goals.length) * 100);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Goal Setting</h2>

      <form onSubmit={handleAddGoal} className="mb-4">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Set your performance goal"
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Goal
        </button>
      </form>

      <h3 className="text-md font-semibold mb-2">Goals List</h3>
      <ul className="list-disc pl-5 mb-4">
        {goalsList.map((goalItem, index) => (
          <li key={index} className="flex items-center">
            <input
              type="checkbox"
              checked={goalItem.completed}
              onChange={() => handleToggleCompletion(index)}
              className="mr-2"
            />
            <span className={goalItem.completed ? 'line-through' : ''}>{goalItem.text}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-md font-semibold mb-2">Goal Progress</h3>
      <div className="bg-gray-300 rounded-full h-4 mb-2">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p>{progress.toFixed(0)}% completed</p>

      {/* Manager View Toggle (For demonstration purposes) */}
      <button
        onClick={() => setIsManager(!isManager)}
        className="mt-4 bg-green-500 text-white p-2 rounded"
      >
        {isManager ? 'Switch to Employee View' : 'Switch to Manager View'}
      </button>
      
      {isManager && (
        <div className="mt-4">
          <h3 className="text-md font-semibold">Manager Approval</h3>
          <p>Please review and approve the goals set by your team.</p>
          {/* Additional manager functionalities can be added here */}
        </div>
      )}
    </div>
  );
};

export default GoalSetting;