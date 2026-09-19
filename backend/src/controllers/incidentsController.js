const incidents = [
  {
    id: 'inc-001',
    type: 'Flood Risk',
    severity: 'high',
    status: 'investigating',
    location: { lat: 38.9072, lng: -77.0369 },
    title: 'Stormwater overflow near downtown',
    description: 'Heavy rain is causing localized flooding in multiple low-lying blocks.',
    reportedAt: new Date().toISOString(),
    assignedDepartment: 'Public Works'
  },
  {
    id: 'inc-002',
    type: 'Air Quality',
    severity: 'medium',
    status: 'monitoring',
    location: { lat: 38.9132, lng: -77.0324 },
    title: 'PM2.5 spike near industrial corridor',
    description: 'Air quality indicators are elevated after morning traffic congestion.',
    reportedAt: new Date().toISOString(),
    assignedDepartment: 'Environment'
  }
];

export const listIncidents = (req, res) => {
  res.json({ success: true, data: incidents });
};

export const getIncidentById = (req, res) => {
  const incident = incidents.find((item) => item.id === req.params.id);

  if (!incident) {
    return res.status(404).json({ success: false, message: 'Incident not found' });
  }

  return res.json({ success: true, data: incident });
};

export const createIncident = (req, res) => {
  const incident = {
    ...req.body,
    id: `inc-${Date.now()}`,
    status: 'new',
    reportedAt: new Date().toISOString()
  };

  incidents.unshift(incident);

  return res.status(201).json({ success: true, data: incident });
};

export const updateIncidentStatus = (req, res) => {
  const { status } = req.body || {};
  const incident = incidents.find((item) => item.id === req.params.id);

  if (!incident) {
    return res.status(404).json({ success: false, message: 'Incident not found' });
  }

  incident.status = status || incident.status;

  return res.json({ success: true, data: incident });
};
