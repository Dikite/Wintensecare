export function healthCheck(req, res) {
  res.json({
    status: 'ok',
    service: 'wintensecare-backend',
    timestamp: new Date().toISOString(),
  });
}
