import { LineChart, ArrowUpRight, ArrowDownRight, Scale, Activity } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'

export default function ProgressTrackerPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Progress Tracker</h1>
          <p className="text-gray-500 mt-1">Visualize your transformation.</p>
        </div>
        <Button variant="primary">Log Today's Metrics</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card padding="md">
          <p className="text-sm text-gray-500 mb-1">Current Weight</p>
          <p className="text-3xl font-black text-white">74.5 <span className="text-sm font-medium text-gray-500">kg</span></p>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><ArrowDownRight size={14} className="text-white" /> 1.2kg this month</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-gray-500 mb-1">Goal Weight</p>
          <p className="text-3xl font-black text-white">68.0 <span className="text-sm font-medium text-gray-500">kg</span></p>
          <p className="text-xs text-gray-500 mt-2">6.5kg remaining</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-gray-500 mb-1">Body Fat %</p>
          <p className="text-3xl font-black text-white">18.5 <span className="text-sm font-medium text-gray-500">%</span></p>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><ArrowDownRight size={14} className="text-white" /> 0.8% this month</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-gray-500 mb-1">BMI</p>
          <p className="text-3xl font-black text-white">23.8</p>
          <p className="text-xs text-gray-500 mt-2">Normal Range</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card padding="lg">
          <h2 className="text-xl font-bold text-white mb-6">Weight Progress</h2>
          <div className="w-full h-64 bg-gray-800 rounded-xl mb-6 flex items-center justify-center border border-gray-700">
            <LineChart className="text-gray-600 w-12 h-12" />
            <span className="ml-2 text-gray-500 font-bold">Chart Placeholder</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase border-b border-gray-800 pb-2">
              <span>Date</span><span>Weight</span><span>Change</span>
            </div>
            {[
              { d: 'Oct 15', w: '74.5 kg', c: '-0.3 kg' },
              { d: 'Oct 8', w: '74.8 kg', c: '-0.4 kg' },
              { d: 'Oct 1', w: '75.2 kg', c: '-0.5 kg' },
              { d: 'Sep 24', w: '75.7 kg', c: '-0.2 kg' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between text-sm font-medium">
                <span className="text-gray-500">{row.d}</span>
                <span className="text-white">{row.w}</span>
                <span className="text-gray-500">{row.c}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Strength Progress</h2>
            <select className="text-sm bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-white">
              <option>Bench Press</option><option>Squat</option><option>Deadlift</option>
            </select>
          </div>
          <div className="w-full h-64 bg-gray-800 rounded-xl mb-6 flex items-center justify-center border border-gray-700">
            <Activity className="text-gray-600 w-12 h-12" />
            <span className="ml-2 text-gray-500 font-bold">Chart Placeholder</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase border-b border-gray-800 pb-2">
              <span>Date</span><span>1RM Est.</span><span>Volume</span>
            </div>
            {[
              { d: 'Oct 14', w: '65 kg', c: '1,200 kg' },
              { d: 'Oct 7', w: '62.5 kg', c: '1,150 kg' },
              { d: 'Sep 30', w: '60 kg', c: '1,080 kg' },
              { d: 'Sep 23', w: '57.5 kg', c: '1,000 kg' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between text-sm font-medium">
                <span className="text-gray-500">{row.d}</span>
                <span className="text-white">{row.w}</span>
                <span className="text-gray-500">{row.c}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
