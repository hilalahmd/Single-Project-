import Report from './report.model.js'

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private (Client)
export const createReport = async (req, res) => {
  try {
    const { reportedTrainer, reason, details } = req.body

    const report = await Report.create({
      reporter: req.user._id,
      reportedTrainer,
      reason,
      details
    })

    res.status(201).json({ success: true, data: report })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get all reports (for manager/admin)
// @route   GET /api/reports
// @access  Private (Manager/Admin)
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate('reporter', 'name email')
      .populate({
        path: 'reportedTrainer',
        populate: { path: 'userId', select: '_id name email status' }
      })
      .sort({ createdAt: -1 })
      .lean()

    res.json(reports)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update report status
// @route   PUT /api/reports/:id/resolve
// @access  Private (Manager/Admin)
export const resolveReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' })
    }

    report.status = 'resolved'
    await report.save()

    res.json({ success: true, data: report })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
