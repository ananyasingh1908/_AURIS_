const projects = [
  {
    id: 'carbon-001',
    name: 'Urban Tree Canopy Expansion',
    location: 'North District',
    creditsAvailable: 840,
    pricePerCredit: 18,
    status: 'active',
    description: 'Restoring green corridors to reduce urban heat and improve air quality.',
    rating: 4.8
  },
  {
    id: 'carbon-002',
    name: 'Solar Streetlight Retrofit',
    location: 'Central Core',
    creditsAvailable: 420,
    pricePerCredit: 24,
    status: 'active',
    description: 'Deployment of energy-efficient lighting across public corridors.',
    rating: 4.6
  }
];

export const listProjects = (req, res) => {
  res.json({ success: true, data: projects });
};

export const createProject = (req, res) => {
  const project = {
    ...req.body,
    id: `carbon-${Date.now()}`,
    status: 'active',
    rating: 4.5
  };

  projects.unshift(project);

  return res.status(201).json({ success: true, data: project });
};

export const purchaseCredits = (req, res) => {
  const { projectId, quantity } = req.body || {};
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const requestedQuantity = Number(quantity || 0);
  if (!requestedQuantity || requestedQuantity > project.creditsAvailable) {
    return res.status(400).json({ success: false, message: 'Invalid quantity requested' });
  }

  project.creditsAvailable -= requestedQuantity;

  return res.json({
    success: true,
    data: {
      projectId,
      purchased: requestedQuantity,
      remaining: project.creditsAvailable,
      totalCost: requestedQuantity * project.pricePerCredit
    }
  });
};

export const retireCredits = (req, res) => {
  const { projectId, quantity } = req.body || {};
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const retiredQuantity = Number(quantity || 0);
  if (!retiredQuantity || retiredQuantity > project.creditsAvailable) {
    return res.status(400).json({ success: false, message: 'Retirement quantity is invalid' });
  }

  project.creditsAvailable -= retiredQuantity;

  return res.json({
    success: true,
    data: {
      projectId,
      retired: retiredQuantity,
      remaining: project.creditsAvailable
    }
  });
};
