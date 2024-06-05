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

  calculateWorkIntervals(orderedTimeblocks) {
    const workIntervals = [];
    let currentIntervalStart = null;
    let currentIntervalEnd = null;

    for (let i = 0; i < orderedTimeblocks.length; i++) {
      const [start, end] = orderedTimeblocks[i];
      const startTotalSeconds = start[0] * 3600 + start[1] * 60 + start[2];
      const endTotalSeconds = end[0] * 3600 + end[1] * 60 + end[2];

      if (!currentIntervalStart) {
        currentIntervalStart = start;
        currentIntervalEnd = end;
      } else {
        const lastEndTotalSeconds = currentIntervalEnd[0] * 3600 + currentIntervalEnd[1] * 60 + currentIntervalEnd[2];
        const breakDuration = startTotalSeconds - lastEndTotalSeconds;

        if (breakDuration >= 1800) { // 30 minutes or more break
          workIntervals.push([currentIntervalStart, currentIntervalEnd]);
          currentIntervalStart = start;
        }
        currentIntervalEnd = end;
      }
    }

    if (currentIntervalStart) {
      workIntervals.push([currentIntervalStart, currentIntervalEnd]);
    }

    console.log('Work Intervals:');
    workIntervals.forEach(interval => {
      const [start, end] = interval;
      const startTotalSeconds = start[0] * 3600 + start[1] * 60 + start[2];
      const endTotalSeconds = end[0] * 3600 + end[1] * 60 + end[2];
      const durationTotalSeconds = endTotalSeconds - startTotalSeconds;

      const hours = Math.floor(durationTotalSeconds / 3600);
      const minutes = Math.floor((durationTotalSeconds % 3600) / 60);
      const seconds = durationTotalSeconds % 60;

      console.log(`Start: ${start[0]}:${start[1]}:${start[2]}, End: ${end[0]}:${end[1]}:${end[2]}, Duration: ${hours}h ${minutes}m ${seconds}s`);
    });

    return workIntervals;
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

    const orderedTimeblocks = this.returnOrderedTimeblocks(bundledData);
    this.calculateWorkIntervals(orderedTimeblocks);
    // Further processing logic will go here
    return bundledData;
  }
};

export default MealBreakCalculations;
