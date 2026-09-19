const notifications = [
  {
    id: 'note-001',
    title: 'Flood response team deployed',
    message: 'Response teams have been assigned to the downtown flood hotspot.',
    type: 'alert',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'note-002',
    title: 'Carbon credit purchase confirmed',
    message: 'Your purchase of 50 credits has been recorded successfully.',
    type: 'success',
    read: true,
    createdAt: new Date().toISOString()
  }
];

export const listNotifications = (req, res) => {
  res.json({ success: true, data: notifications });
};

export const markNotificationRead = (req, res) => {
  const notification = notifications.find((item) => item.id === req.params.id);

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  notification.read = true;

  return res.json({ success: true, data: notification });
};
