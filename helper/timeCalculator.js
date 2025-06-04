// Helper function to estimate days left for order completion
function estimateDaysLeft(createdAt, weight) {
  const now = new Date();
  const orderDate = new Date(createdAt);
  const daysPassed = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
  
  // Base processing time: 3 days for normal load
  let baseDays = 3;
  
  // Add extra days for heavy loads
  if (weight > 10) {
    baseDays += 2;
  } else if (weight > 5) {
    baseDays += 1;
  }
  
  const daysLeft = baseDays - daysPassed;
  return Math.max(0, daysLeft); // Don't return negative days
}

// Helper function to format time remaining
function formatTimeRemaining(daysLeft) {
  if (daysLeft === 0) {
    return 'Ready for pickup';
  } else if (daysLeft === 1) {
    return '1 day remaining';
  } else {
    return `${daysLeft} days remaining`;
  }
}

module.exports = {
  estimateDaysLeft,
  formatTimeRemaining
};