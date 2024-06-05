// mealBreakCalculations.js

const MealBreakCalculations = {
    bundleTimeBlocks(timeBlocks) {
      return timeBlocks.map(block => [
        [parseInt(block.clockIn.hour), parseInt(block.clockIn.minute), parseInt(block.clockIn.second)],
        [parseInt(block.clockOut.hour), parseInt(block.clockOut.minute), parseInt(block.clockOut.second)]
      ]);
    },
  
    hasOverlappingTimeBlocks(bundledData) {
      for (let i = 0; i < bundledData.length; i++) {
        const [startA, endA] = bundledData[i];
        const startATotalSeconds = startA[0] * 3600 + startA[1] * 60 + startA[2];
        const endATotalSeconds = endA[0] * 3600 + endA[1] * 60 + endA[2];
  
        for (let j = i + 1; j < bundledData.length; j++) {
          const [startB, endB] = bundledData[j];
          const startBTotalSeconds = startB[0] * 3600 + startB[1] * 60 + startB[2];
          const endBTotalSeconds = endB[0] * 3600 + endB[1] * 60 + endB[2];
  
          if (
            (startATotalSeconds < endBTotalSeconds && endATotalSeconds > startBTotalSeconds) ||
            (startBTotalSeconds < endATotalSeconds && endBTotalSeconds > startATotalSeconds)
          ) {
            console.log('Overlapping timeblocks detected');
            return true;
          }
        }
      }
      console.log('No overlapping time blocks detected');
      return false;
    },
  
    hasInvalidatedTimeBlocks(bundledData) {
      for (let i = 0; i < bundledData.length; i++) {
        const [start, end] = bundledData[i];
        const startTotalSeconds = start[0] * 3600 + start[1] * 60 + start[2];
        const endTotalSeconds = end[0] * 3600 + end[1] * 60 + end[2];
  
        if (endTotalSeconds <= startTotalSeconds) {
          console.log(`Invalid time block detected: Clock out time is not after clock in time for block ${i + 1}`);
          return true;
        }
      }
      console.log('All time blocks are valid');
      return false;
    },
  
    returnOrderedTimeblocks(bundledData) {
      const orderedTimeblocks = bundledData.sort((a, b) => {
        const startATotalSeconds = a[0][0] * 3600 + a[0][1] * 60 + a[0][2];
        const startBTotalSeconds = b[0][0] * 3600 + b[0][1] * 60 + b[0][2];
        return startATotalSeconds - startBTotalSeconds;
      });
      console.log('Ordered Time Blocks:', orderedTimeblocks);
      return orderedTimeblocks;
    },
  
    runMealBreakCalculations(timeBlocks) {
      const bundledData = this.bundleTimeBlocks(timeBlocks);
      console.log('Bundled Data:', bundledData);
  
      if (this.hasInvalidatedTimeBlocks(bundledData)) {
        return;
      }
  
      if (this.hasOverlappingTimeBlocks(bundledData)) {
        return;
      }
  
      this.returnOrderedTimeblocks(bundledData);
      // Further processing logic will go here
      return bundledData;
    }
  };
  
  export default MealBreakCalculations;
  