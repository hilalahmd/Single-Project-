import ProgressLog from './progress.model.js';

// 1. Data Save Cheyyanulla function (POST)
export const logProgress = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user
    const { date, weight, bodyFat, measurements, strengthLog } = req.body;

    // Aa theeyathiyil already log undo ennu nokkunnu
    let log = await ProgressLog.findOne({ user: userId, date });

    if (!log) {
      // Log illenkil puthiyathu create cheyyunnu
      log = new ProgressLog({ user: userId, date });
    }

    // Varunna data onnukil update aakkum, allenkil add cheyyum
    if (weight !== undefined) log.weight = weight;
    if (bodyFat !== undefined) log.bodyFat = bodyFat;
    if (measurements) log.measurements = { ...log.measurements, ...measurements };

    // Strength record undo ennu nokkunnu
    if (strengthLog) {
      // Same exercise already undo ennu check cheyyunnu
      const existingExerciseIndex = log.strengthLogs.findIndex(s => s.exercise === strengthLog.exercise);
      if (existingExerciseIndex > -1) {
        log.strengthLogs[existingExerciseIndex] = strengthLog;
      } else {
        log.strengthLogs.push(strengthLog);
      }
    }

    await log.save(); // Database-il save cheyyunnu

    res.status(200).json({ success: true, message: 'Progress logged successfully', log });
  } catch (error) {
    console.error('Error logging progress:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// 2. Data Fetch Cheyyanulla function (GET)
export const getProgressHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // User-nte ellla progress history edukkunnu (Date ascending order-il)
    const history = await ProgressLog.find({ user: userId }).sort({ date: 1 });

    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error('Error fetching progress history:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
