export const simulateMLDetection = () => {
  // Simulate realistic ML detection results
  const isNoBall = Math.random() < 0.3; // 30% chance of no ball
  const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
  const detectionTime = Math.floor(Math.random() * 100) + 20; // 20-120ms

  const boundingBoxes = [
    {
      type: 'Bowler',
      confidence: Math.random() * 0.2 + 0.8,
      coordinates: { x: 100, y: 50, width: 80, height: 120 }
    },
    {
      type: 'Cricket Ball',
      confidence: Math.random() * 0.1 + 0.9,
      coordinates: { x: 200, y: 80, width: 15, height: 15 }
    },
    {
      type: 'Crease Line',
      confidence: Math.random() * 0.15 + 0.85,
      coordinates: { x: 0, y: 150, width: 300, height: 5 }
    }
  ];

  const metrics = {
    frontFootPosition: isNoBall ? Math.random() * 20 + 5 : -(Math.random() * 15 + 2), // cm over/behind line
    bowlerLine: Math.random() * 10 - 5, // degrees from center
    ballHeight: Math.random() * 50 + 70 // cm from ground
  };

  return {
    isNoBall,
    confidence,
    detectionTime,
    boundingBoxes,
    metrics,
    timestamp: new Date().toISOString(),
    modelVersion: '2.1.3-cricket-detection'
  };
};

export const generateMatchAnalytics = () => {
  const matches = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    team1: ['India', 'Australia', 'England', 'Pakistan', 'South Africa'][Math.floor(Math.random() * 5)],
    team2: ['New Zealand', 'Sri Lanka', 'Bangladesh', 'West Indies', 'Afghanistan'][Math.floor(Math.random() * 5)],
    totalBalls: Math.floor(Math.random() * 300) + 200,
    noBalls: Math.floor(Math.random() * 15) + 2,
    accuracy: Math.random() * 0.1 + 0.9
  }));

  return matches;
};