// mealBreakCalculations.js

export function bundleTimeBlocks(timeBlocks) {
    return timeBlocks.map(block => [
      [parseInt(block.clockIn.hour), parseInt(block.clockIn.minute), parseInt(block.clockIn.second)],
      [parseInt(block.clockOut.hour), parseInt(block.clockOut.minute), parseInt(block.clockOut.second)]
    ]);
  }
  