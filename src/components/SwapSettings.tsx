'use client'

interface SwapSettingsProps {
  settings: {
    slippage: number
    deadline: number
    gasPrice?: string
  }
  onSettingsChange: (settings: {
    slippage: number
    deadline: number
    gasPrice?: string
  }) => void
}

const SLIPPAGE_PRESETS = [0.1, 0.5, 1.0, 2.0]

export function SwapSettings({ settings, onSettingsChange }: SwapSettingsProps) {
  const updateSlippage = (slippage: number) => {
    onSettingsChange({ ...settings, slippage })
  }

  const updateDeadline = (deadline: number) => {
    onSettingsChange({ ...settings, deadline })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slippage Tolerance
        </label>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {SLIPPAGE_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => updateSlippage(preset)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  settings.slippage === preset
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-1">
            <input
              type="number"
              min="0.1"
              max="50"
              step="0.1"
              value={settings.slippage}
              onChange={(e) => updateSlippage(parseFloat(e.target.value) || 0.5)}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction Deadline
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            max="60"
            value={settings.deadline}
            onChange={(e) => updateDeadline(parseInt(e.target.value) || 20)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-500">minutes</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Transaction Settings:</p>
        <p>• Slippage: {settings.slippage}% - Maximum price movement allowed</p>
        <p>• Deadline: {settings.deadline} min - Transaction expiry time</p>
        <p>• Higher slippage reduces failed transactions but may result in worse rates</p>
      </div>
    </div>
  )
}
