import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import useStore from '../engine/gameState';

export default function BatteryTrend() {
  const [history, setHistory] = useState([]);
  const batteryLevel = useStore((state) => state.batteryLevel);

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory((prev) => [...prev.slice(-20), { val: batteryLevel }]);
    }, 1000);
    return () => clearInterval(interval);
  }, [batteryLevel]);

  return (
    <div style={{ width: '100%', height: '150px' }}> {/* Force a height here */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history}>
          <Line type="monotone" dataKey="val" stroke="#00f3ff" strokeWidth={2} dot={false} />
          <YAxis domain={[0, 100]} hide />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}