import express from 'express'
import { protect, restrictTo } from '../../middleware/authenticate.js'
import { createReport, getAllReports, resolveReport } from './report.controller.js'

const router = express.Router()

// Client can create a report
router.post('/', protect, restrictTo('user'), createReport)

// Admin/Manager can view and resolve reports
router.get('/', protect, restrictTo('admin', 'manager'), getAllReports)
router.put('/:id/resolve', protect, restrictTo('admin', 'manager'), resolveReport)

export default router
