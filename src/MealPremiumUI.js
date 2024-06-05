import React, { useState } from 'react';
import './MealPremiumUI.css';
import MealBreakCalculations from './mealBreakCalculations'; // Import the MealBreakCalculations object

function MealPremiumUI() {
  const [timeBlocks, setTimeBlocks] = useState([{ clockIn: { hour: '00', minute: '00', second: '00' }, clockOut: { hour: '00', minute: '00', second: '00' } }]);

  const handleAddTimeBlock = () => {
    setTimeBlocks([...timeBlocks, { clockIn: { hour: '00', minute: '00', second: '00' }, clockOut: { hour: '00', minute: '00', second: '00' } }]);
  };

  const handleRemoveTimeBlock = (index) => {
    const newTimeBlocks = timeBlocks.filter((_, i) => i !== index);
    setTimeBlocks(newTimeBlocks);
  };

  const handleChange = (index, timeType, field, value) => {
    const newTimeBlocks = timeBlocks.map((block, i) => (
      i === index ? { ...block, [timeType]: { ...block[timeType], [field]: value } } : block
    ));
    setTimeBlocks(newTimeBlocks);
  };

  const handleClearAll = () => {
    setTimeBlocks([{ clockIn: { hour: '00', minute: '00', second: '00' }, clockOut: { hour: '00', minute: '00', second: '00' } }]);
  };

  const handleCalculate = () => {
    const bundledData = MealBreakCalculations.runMealBreakCalculations(timeBlocks);
    // Further processing logic can be added here
  };

  const generateOptions = (limit) => {
    return [...Array(limit).keys()].map(i => (
      <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
    ));
  };

  return (
    <div className="meal-premium-ui">
      <h1>Meal Premiums</h1>
      {timeBlocks.map((block, index) => (
        <div key={index} className="time-block">
          <label>
            Clock In:
            <select value={block.clockIn.hour} onChange={(e) => handleChange(index, 'clockIn', 'hour', e.target.value)}>
              {generateOptions(24)}
            </select>
            :
            <select value={block.clockIn.minute} onChange={(e) => handleChange(index, 'clockIn', 'minute', e.target.value)}>
              {generateOptions(60)}
            </select>
            :
            <select value={block.clockIn.second} onChange={(e) => handleChange(index, 'clockIn', 'second', e.target.value)}>
              {generateOptions(60)}
            </select>
          </label>
          <label>
            Clock Out:
            <select value={block.clockOut.hour} onChange={(e) => handleChange(index, 'clockOut', 'hour', e.target.value)}>
              {generateOptions(24)}
            </select>
            :
            <select value={block.clockOut.minute} onChange={(e) => handleChange(index, 'clockOut', 'minute', e.target.value)}>
              {generateOptions(60)}
            </select>
            :
            <select value={block.clockOut.second} onChange={(e) => handleChange(index, 'clockOut', 'second', e.target.value)}>
              {generateOptions(60)}
            </select>
          </label>
          <button className="remove-button" onClick={() => handleRemoveTimeBlock(index)}>Remove</button>
        </div>
      ))}
      <button className="add-button" onClick={handleAddTimeBlock}>Add Time Block</button>
      <button className="clear-button" onClick={handleClearAll}>Clear All</button>
      <button className="calculate-button" onClick={handleCalculate}>Calculate</button>
    </div>
  );
}

export default MealPremiumUI;
