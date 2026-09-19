export const getStatus = (req, res) => {
  res.json({
    success: true,
    message: 'AURIS backend is running',
    timestamp: new Date().toISOString()
  });
};
