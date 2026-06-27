import React from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import useStore from '../engine/gameState';

export default function GridChart() {
  // Use selector to only re-render when history changes
  const history = useStore((state) => state.history);

  return (
    <div style={{ 
      background: '#0a0a0f', 
      padding: '20px', 
      borderRadius: '8px', 
      border: '1px solid #1a1a2e',
      height: '300px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ color: '#fff', fontSize: '14px', letterSpacing: '2px', marginBottom: '20px', marginTop: 0 }}>
        BATTERY STABILITY TREND
      </h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history}>
          <YAxis 
            domain={[0, 100]} 
            stroke="#444" 
            tick={{fontSize: 10, fill: '#666'}} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip 
            contentStyle={{ 
              background: '#000', 
              border: '1px solid #00f3ff', 
              borderRadius: '4px',
              fontSize: '12px'
            }} 
            itemStyle={{ color: '#00f3ff' }}
          />
          <Line 
            type="monotone" 
            dataKey="battery" // This must match the key used in gameState history
            stroke="#00f3ff" 
            strokeWidth={3} 
            dot={false} 
            isAnimationActive={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}