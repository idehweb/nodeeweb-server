export default class HealthController {
  static health(req, res, next) {
    return res.json({ message: 'healthy!' });
  }
}
