import ProgressLog from './progress.model.js';

/**
 * logProgress — saves or updates a user's progress entry for a given date.
 * 
 * VALIDATION ADDED:
 * - date format checked (YYYY-MM-DD) to prevent arbitrary string injection
 * - weight and bodyFat checked to be positive numbers
 * - strengthLog values (weight, reps, sets) checked to be positive numbers
 * 
 * WHY: without validation, a client could send negative weight or NaN
 * which would corrupt the progress chart data.
 */
export const logProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, weight, bodyFat, measurements, strengthLog } = req.body;

    // Validate date format
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: 'A valid date in YYYY-MM-DD format is required.' });
    }

    // Validate weight if provided
    if (weight !== undefined) {
      const w = Number(weight);
      if (isNaN(w) || w <= 0 || w > 500) {
        return res.status(400).json({ success: false, message: 'weight must be a positive number (in kg).' });
      }
    }

    // Validate body fat if provided
    if (bodyFat !== undefined) {
      const bf = Number(bodyFat);
      if (isNaN(bf) || bf < 0 || bf > 100) {
        return res.status(400).json({ success: false, message: 'bodyFat must be between 0 and 100.' });
      }
    }

    // Validate strength log if provided
    if (strengthLog) {
      if (!strengthLog.exercise || String(strengthLog.exercise).trim() === '') {
        return res.status(400).json({ success: false, message: 'strengthLog.exercise name is required.' });
      }
      for (const field of ['weight', 'reps', 'sets']) {
        const val = Number(strengthLog[field]);
        if (isNaN(val) || val <= 0) {
          return res.status(400).json({ success: false, message: `strengthLog.${field} must be a positive number.` });
        }
      }
    }

    // Find existing log for this date, or create new
    let log = await ProgressLog.findOne({ user: userId, date });
    if (!log) {
      log = new ProgressLog({ user: userId, date });
    }

    if (weight !== undefined) log.weight = Number(weight);
    if (bodyFat !== undefined) log.bodyFat = Number(bodyFat);
    if (measurements) log.measurements = { ...log.measurements.toObject?.() || log.measurements, ...measurements };

    if (strengthLog) {
      const existingIndex = log.strengthLogs.findIndex(s => s.exercise === strengthLog.exercise);
      if (existingIndex > -1) {
        log.strengthLogs[existingIndex] = strengthLog;
      } else {
        log.strengthLogs.push(strengthLog);
      }
    }

    await log.save();
    res.status(200).json({ success: true, message: 'Progress logged successfully', log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * getProgressHistory — returns all progress logs for the authenticated user.
 * Added .lean() since we only read and display data — no .save() calls on results.
 * Added .limit(365) to prevent unbounded query (max 1 year of history).
 */
export const getProgressHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Limit to 365 entries (1 year of daily logs) to prevent unbounded query
    // WHY: without a limit, this query returns every single log entry ever created,
    //      which could become very large and slow over time
    const history = await ProgressLog.find({ user: userId })
      .sort({ date: 1 })
      .limit(365)
      .lean();

    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
