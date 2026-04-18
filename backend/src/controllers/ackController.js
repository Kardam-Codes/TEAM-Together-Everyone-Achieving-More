// OWNER - ASU
// PURPOSE - Handle acknowledgement system, tracking alert and response times in-memory

let acknowledgements = []; // In-memory storage for acknowledgements

const postAck = (req, res) => {
  try {
    const responseTime = new Date();
    // For now, assume alert time is 1 minute ago (can be improved later)
    const alertTime = new Date(responseTime.getTime() - 60000);

    const ack = {
      alertTime,
      responseTime
    };

    acknowledgements.push(ack);

    res.json({ message: 'Acknowledgement recorded', ack });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record acknowledgement' });
  }
};

// Optional: Function to get acknowledgements (for testing/debugging)
const getAcks = (req, res) => {
  res.json(acknowledgements);
};

module.exports = {
  postAck,
  getAcks // Optional
};