const complaints = [
  {
    id: 'complaint-001',
    title: 'Broken streetlight on Oak Avenue',
    description: 'The streetlight has been non-functional for three nights.',
    category: 'Infrastructure',
    status: 'open',
    citizenName: 'Ava Patel',
    priority: 'medium',
    createdAt: new Date().toISOString()
  },
  {
    id: 'complaint-002',
    title: 'Waste bin overflow near bus station',
    description: 'Overflowing trash is causing sanitation issues during peak hours.',
    category: 'Waste Management',
    status: 'in-review',
    citizenName: 'Miles Chen',
    priority: 'high',
    createdAt: new Date().toISOString()
  }
];

export const listComplaints = (req, res) => {
  res.json({ success: true, data: complaints });
};

export const getComplaintById = (req, res) => {
  const complaint = complaints.find((item) => item.id === req.params.id);

  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  return res.json({ success: true, data: complaint });
};

export const createComplaint = (req, res) => {
  const complaint = {
    ...req.body,
    id: `complaint-${Date.now()}`,
    status: 'open',
    createdAt: new Date().toISOString()
  };

  complaints.unshift(complaint);

  return res.status(201).json({ success: true, data: complaint });
};

export const updateComplaintStatus = (req, res) => {
  const { status } = req.body || {};
  const complaint = complaints.find((item) => item.id === req.params.id);

  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  complaint.status = status || complaint.status;

  return res.json({ success: true, data: complaint });
};
