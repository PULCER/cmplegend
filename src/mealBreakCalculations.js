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

  //This essentially merges the timeblocks that have a break less than 30 minutes in between them, and then breaks appart new intervals when over a 30 minute break is detected
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

    workIntervals.forEach(interval => {
      const [start, end, durationTotalSeconds] = interval;
      const hours = Math.floor(durationTotalSeconds / 3600);
      const minutes = Math.floor((durationTotalSeconds % 3600) / 60);
      const seconds = durationTotalSeconds % 60;
      console.log(`Start: ${start[0]}:${start[1]}:${start[2]}, End: ${end[0]}:${end[1]}:${end[2]}, Duration: ${hours}h ${minutes}m ${seconds}s`);
    });

    return workIntervals;
  },

  //Calculates the total workday duration
  returnTotalWorkdayDuration(workIntervals) {
    const totalDurationSeconds = workIntervals.reduce((acc, interval) => acc + interval[2], 0);
    const hours = Math.floor(totalDurationSeconds / 3600);
    const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
    const seconds = totalDurationSeconds % 60;

    return [hours, minutes, seconds];
  },

  //Checks if the first break was compliant
  firstBreakWasCompliant(workIntervals) {
    let accumulatedTime = 0;
  
    for (const interval of workIntervals) {
      accumulatedTime += interval[2];
      if (accumulatedTime > 18000) { // 5 hours
        break;
      }
  
      if (interval[2] >= 1800) { // Check if the break was 30 minutes or more
        return true;
      }
    }
    return false;
  },
  
//Checks if the second break was compliant
  secondBreakWasCompliant(workIntervals) {
    let accumulatedTime = 0;
  
    for (const interval of workIntervals) {
      accumulatedTime += interval[2];
      if (accumulatedTime > 18000 && accumulatedTime <= 36000) { // Between 5 and 10 hours
        if (interval[2] >= 1800) { // 30 minutes or more break
          return true;
        }
      }
    }
    return false;
  },

  //Takes the UI data, maps it to a nested array, validates it, returns the compliance status of both meal breaks
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
  
    let firstBreakCompliant = true;
    let secondBreakCompliant = true;
  
    if (totalWorkdayDurationSeconds < 21600) { // Less than 6 hours
      firstBreakCompliant = true;
      secondBreakCompliant = true;
    } else {
      firstBreakCompliant = this.firstBreakWasCompliant(workIntervals);
  
      if (totalWorkdayDurationSeconds >= 21600 && totalWorkdayDurationSeconds < 36000) { // More than 6 hours but less than 10 hours
        secondBreakCompliant = true;
      } else if (totalWorkdayDurationSeconds >= 36000 && !firstBreakCompliant) { // More than 10 hours and first break wasn't compliant
        secondBreakCompliant = this.secondBreakWasCompliant(workIntervals);
      } else if (totalWorkdayDurationSeconds >= 36000 && totalWorkdayDurationSeconds < 43200 && firstBreakCompliant) { // More than 10 hours and less than 12 hours and first break was compliant
        secondBreakCompliant = true;
      } else if (totalWorkdayDurationSeconds >= 43200){
        firstBreakCompliant = this.firstBreakWasCompliant(workIntervals);
        secondBreakCompliant = this.secondBreakWasCompliant(workIntervals);
      }
    }
  
    console.log(`First break compliant: ${firstBreakCompliant}`);
    console.log(`Second break compliant: ${secondBreakCompliant}`);
  
    return [firstBreakCompliant, secondBreakCompliant];
  }
  
};

export default MealBreakCalculations;
