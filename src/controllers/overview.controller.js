const OverviewService = require('../services/overview.service');

class OverviewController {
  async getOverview(req, res) {
    try {
      const data = await OverviewService.getOverviewStats();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new OverviewController();
