const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Enhanced AI cost estimation logic
const estimateCost = (data) => {
  const { area, floors, quality } = data;
  let baseCost = area * 100; // Base cost per unit area
  baseCost += floors * 500; // Additional cost per floor
  baseCost *= quality === 'high' ? 1.5 : quality === 'medium' ? 1.2 : 1; // Quality multiplier
  return Math.round(baseCost * (1 + Math.random() * 0.1)); // Add 0-10% variance
};

app.post('/estimate', (req, res) => {
  try {
    const data = req.body;
    if (!data.area || !data.floors || !data.quality) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const cost = estimateCost(data);
    res.json({ cost, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Orchestration bot running on port ${PORT}`));