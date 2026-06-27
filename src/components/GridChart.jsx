import React from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import useStore from '../engine/gameState';

export default function GridChart() {
  // Safety fallback: if history is undefined, default to an empty array to prevent crashes
  const history = useStore((state) => state.history || []);

  return (
    <div style={{ 
      width: '100%', 
      height: '300px', 
      background: 'rgba(0, 0, 0, 0.7)', 
      padding: '20px', 
      borderRadius: '8px', 
      marginBottom: '20px',
      border: '1px solid #333',
      borderTop: '4px solid #00f3ff'
    }}>
      <h4 style={{ 
        margin: '0 0 20px 0', 
        color: '#00f3ff', 
        fontFamily: '"Courier New", monospace',
        letterSpacing: '2px',
        textTransform: 'uppercase'
      }}>
        Battery Telemetry History
      </h4>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history}>
          {/* Adds subtle horizontal lines to make the chart easier to read */}
          <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
          
          <YAxis 
            domain={[0, 100]} 
            stroke="#666" 
            tick={{ fill: '#888', fontSize: 12, fontFamily: 'monospace' }} 
          />
          
          <Tooltip 
            contentStyle={{ 
              background: 'rgba(0,0,0,0.9)', 
              border: '1px solid #00f3ff', 
              color: '#00f3ff', 
              fontFamily: 'monospace' 
            }} 
            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
            labelStyle={{ display: 'none' }}
          />
          
          <Line 
            type="monotone" 
            dataKey="battery" 
            stroke="#00f3ff" 
            strokeWidth={3} 
            dot={false} 
            isAnimationActive={false} 
            style={{ filter: 'drop-shadow(0px 0px 5px rgba(0, 243, 255, 0.5))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}