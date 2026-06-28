import React from 'react';
import { 
  Area, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ComposedChart, Legend, ReferenceLine 
} from 'recharts';
import useStore from '../engine/gameState';

export default function GridChart() {
  const history = useStore((state) => state.history || []);

  // 1. DATA SANITIZATION PIPELINE
  // We clean the data before it ever touches the chart engine
  const sanitizedData = history
    .filter(h => h !== null && typeof h === 'object')
    .map(h => ({
      time: h.time ?? 0,
      battery: typeof h.battery === 'number' ? h.battery : 0,
      efficiency: typeof h.efficiency === 'number' ? h.efficiency : 0
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(5, 5, 8, 0.95)',
          border: '1px solid #00f3ff',
          padding: '12px',
          boxShadow: '0 0 15px rgba(0, 243, 255, 0.3)',
          fontFamily: '"Courier New", monospace'
        }}>
          <p style={{ color: '#aaa', margin: '0 0 5px 0', fontSize: '10px' }}>TICK: {label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: 0, fontSize: '12px', fontWeight: 'bold' }}>
              {`${entry.name.toUpperCase()}: ${entry.value.toFixed(1)}${entry.name === 'battery' ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid-chart-container">
      <h3 className="neon-chart-title">GRID ANALYTICS MATRIX</h3>
      
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={sanitizedData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 243, 255, 0.1)" vertical={false} />
            
            <XAxis dataKey="time" hide />
            
            {/* Battery Axis (Left) - Normalized 0 to 100 */}
            <YAxis yAxisId="left" domain={[0, 100]} stroke="#ffb700" tick={{fontSize: 10}} />
            
            {/* Efficiency Axis (Right) - Normalized 0 to 100 */}
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#00f3ff" tick={{fontSize: 10}} />
            
            <ReferenceLine yAxisId="left" y={20} stroke="red" strokeDasharray="3 3" />
            
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            
            {/* The Area Chart Layer */}
            <Area 
              yAxisId="right" 
              type="monotone" 
              name="efficiency" 
              dataKey="efficiency" 
              fill="url(#colorEff)" 
              stroke="#00f3ff" 
              isAnimationActive={false} 
            />
            
            {/* The Battery Line Layer */}
            <Line 
              yAxisId="left" 
              type="stepAfter" 
              name="battery" 
              dataKey="battery" 
              stroke="#ffb700" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <style>{`
        .grid-chart-container {
          background: #050508 !important;
          border: 1.5px solid #00f3ff !important;
          border-radius: 8px !important;
          padding: 20px !important;
          height: 320px !important;
          display: flex !important;
          flex-direction: column !important;
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.15) !important;
          box-sizing: border-box !important;
        }
        .neon-chart-title {
          color: #fff !important; font-size: 14px !important; letter-spacing: 4px !important;
          margin: 0 0 15px 0 !important; text-align: center !important;
          text-shadow: 0 0 10px #00f3ff !important; text-transform: uppercase !important;
          font-family: 'Courier New', Courier, monospace !important;
        }
        .chart-wrapper { flex-grow: 1; width: 100%; height: 100%; }
      `}</style>
    </div>
  );
}