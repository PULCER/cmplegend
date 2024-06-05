// mealBreakCalculations.js

const MealBreakCalculations = {
    // Define the bundleTimeBlocks function that takes timeBlocks as an argument and returns a bundled array three layers deep. 
    // The innermost array should contain two elements, each representing the hour, minute, and second of the clockIn and clockOut times.
    // The outermost array should contain all the bundled time blocks.
  
    bundleTimeBlocks(timeBlocks) {
      return timeBlocks.map(block => [
        [parseInt(block.clockIn.hour), parseInt(block.clockIn.minute), parseInt(block.clockIn.second)],
        [parseInt(block.clockOut.hour), parseInt(block.clockOut.minute), parseInt(block.clockOut.second)]
      ]);
    },
  
    runMealBreakCalculations(timeBlocks) {
      const bundledData = this.bundleTimeBlocks(timeBlocks);
      console.log('Bundled Data:', bundledData);
      // Further processing logic will go here
      return bundledData;
    }
  };
  
  export default MealBreakCalculations;
  