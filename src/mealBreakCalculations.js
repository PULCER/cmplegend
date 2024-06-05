const MealBreakCalculations = {

  //Processes the UI data into nested arrays. 
  bundleTimeBlocks(timeBlocks) {
    return timeBlocks.map(block => [
      [parseInt(block.clockIn.hour), parseInt(block.clockIn.minute), parseInt(block.clockIn.second)],
      [parseInt(block.clockOut.hour), parseInt(block.clockOut.minute), parseInt(block.clockOut.second)]
    ]);
  },

    //Checks if every time block is valid IE clock out is after clock in
    hasInvalidatedTimeBlocks(bundledData) {
      for (let i = 0; i < bundledData.length; i++) {
        const [start, end] = bundledData[i];
        const startTotalSeconds = start[0] * 3600 + start[1] * 60 + start[2];
        const endTotalSeconds = end[0] * 3600 + end[1] * 60 + end[2];
  
        if (endTotalSeconds <= startTotalSeconds) {
          return true;
        }
      }
      return false;
    },

  //Checks if timeblocks are overlapping
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
          return true;
        }
      }
    }
    return false;
  },

  //Orders the timeblocks
  returnOrderedTimeblocks(bundledData) {
    const orderedTimeblocks = bundledData.sort((a, b) => {
      const startATotalSeconds = a[0][0] * 3600 + a[0][1] * 60 + a[0][2];
      const startBTotalSeconds = b[0][0] * 3600 + b[0][1] * 60 + b[0][2];
      return startATotalSeconds - startBTotalSeconds;
    });
    return orderedTimeblocks;
  },

  calculateWorkIntervals(orderedTimeblocks) {
    const workIntervals = [];
    let currentIntervalStart = null;
    let currentIntervalEnd = null;
    let currentIntervalDuration = 0;

    for (let i = 0; i < orderedTimeblocks.length; i++) {
      const [start, end] = orderedTimeblocks[i];
      const startTotalSeconds = start[0] * 3600 + start[1] * 60 + start[2];
      const endTotalSeconds = end[0] * 3600 + end[1] * 60 + end[2];

      if (!currentIntervalStart) {
        currentIntervalStart = start;
        currentIntervalEnd = end;
        currentIntervalDuration = endTotalSeconds - startTotalSeconds;
      } else {
        const lastEndTotalSeconds = currentIntervalEnd[0] * 3600 + currentIntervalEnd[1] * 60 + currentIntervalEnd[2];
        const breakDuration = startTotalSeconds - lastEndTotalSeconds;

        if (breakDuration >= 1800) { // 30 minutes or more break
          workIntervals.push([currentIntervalStart, currentIntervalEnd, currentIntervalDuration]);
          currentIntervalStart = start;
          currentIntervalDuration = endTotalSeconds - startTotalSeconds;
        } else {
          currentIntervalDuration += endTotalSeconds - startTotalSeconds;
        }
        currentIntervalEnd = end;
      }
    }

    if (currentIntervalStart) {
      workIntervals.push([currentIntervalStart, currentIntervalEnd, currentIntervalDuration]);
    }

    console.log('Work Intervals:');
    workIntervals.forEach(interval => {
      const [start, end, durationTotalSeconds] = interval;
      const hours = Math.floor(durationTotalSeconds / 3600);
      const minutes = Math.floor((durationTotalSeconds % 3600) / 60);
      const seconds = durationTotalSeconds % 60;

      console.log(`Start: ${start[0]}:${start[1]}:${start[2]}, End: ${end[0]}:${end[1]}:${end[2]}, Duration: ${hours}h ${minutes}m ${seconds}s`);
    });

    return workIntervals;
  },

  returnTotalWorkdayDuration(workIntervals) {
    const totalDurationSeconds = workIntervals.reduce((acc, interval) => acc + interval[2], 0);
    const hours = Math.floor(totalDurationSeconds / 3600);
    const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
    const seconds = totalDurationSeconds % 60;

    console.log(`Total Workday Duration: ${hours}h ${minutes}m ${seconds}s`);
    return [hours, minutes, seconds];
  },

  firstBreakWasCompliant(workIntervals) {
    let accumulatedTime = 0;
  
    for (const interval of workIntervals) {
      accumulatedTime += interval[2];
      if (accumulatedTime > 18000) { // 5 hours
        break;
      }
  
      if (interval[2] >= 1800) { // Check if the break was 30 minutes or more
        console.log('Compliant: A 30 minute break was taken in the first 5 hours of combined working hours.');
        return true;
      }
    }
  
    console.log('Non-compliant: No 30 minute break was taken in the first 5 hours of combined working hours.');
    return false;
  }
  

  secondBreakWasCompliant(workIntervals) {
    const totalDuration = this.returnTotalWorkdayDuration(workIntervals);
    const totalDurationSeconds = totalDuration[0] * 3600 + totalDuration[1] * 60 + totalDuration[2];
  
    if (totalDurationSeconds <= 43200) { // 12 hours
      console.log('Total workday duration is 12 hours or less. No second meal break required.');
      return true;
    }
  
    let accumulatedTime = 0;
    let foundBreak = false;
    let firstBreakCompliant = this.firstBreakWasCompliant(workIntervals);
  
    if (!firstBreakCompliant) {
      for (const interval of workIntervals) {
        accumulatedTime += interval[2];
        if (accumulatedTime > 18000 && accumulatedTime <= 36000) { // Between 5 and 10 hours
          const breakDuration = interval[2];
          if (breakDuration >= 1800) { // 30 minutes or more break
            foundBreak = true;
            break;
          }
        }
      }
  
      if (foundBreak) {
        console.log('Compliant: A 30 minute break was taken between 5 and 10 hours of total working hours.');
      } else {
        console.log('Non-compliant: No 30 minute break was taken between 5 and 10 hours of total working hours.');
      }
  
      return foundBreak;
    } else {

  
      if (foundBreak) {
        console.log('Compliant: A 30 minute break was taken between 6 and 12 hours of total working hours.');
      } else {
        console.log('Non-compliant: No 30 minute break was taken between 6 and 12 hours of total working hours.');
      }
  
      return foundBreak;
    }
  },

  runMealBreakCalculations(timeBlocks) {
    const bundledData = this.bundleTimeBlocks(timeBlocks);
  
    if (this.hasInvalidatedTimeBlocks(bundledData)) {
      return;
    }
  
    if (this.hasOverlappingTimeBlocks(bundledData)) {
      return;
    }
  
    const orderedTimeblocks = this.returnOrderedTimeblocks(bundledData);
    const workIntervals = this.calculateWorkIntervals(orderedTimeblocks);
    const totalWorkdayDuration = this.returnTotalWorkdayDuration(workIntervals);
    const totalWorkdayDurationSeconds = totalWorkdayDuration[0] * 3600 + totalWorkdayDuration[1] * 60 + totalWorkdayDuration[2];

    //If workday is less than 6 hours the day is always compliant. 
    if (totalWorkdayDurationSeconds < 21600) { //Less than 6 hours
      return [true, true];
    }

    //If workday is more than 6 hours and less than 10 hours
    if (totalWorkdayDurationSeconds >= 21600 && totalWorkdayDurationSeconds < 36000) { // More than 6 hours but less than 10 hours
      const firstBreakCompliant = this.firstBreakWasCompliant(workIntervals);
      return [firstBreakCompliant, true];
    }


    return [false, false]
   
  }
};

export default MealBreakCalculations;
