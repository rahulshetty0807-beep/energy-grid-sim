import { useEffect, useRef, useState, useCallback } from 'react';
import useStore from './gameState';

export const useTelemetrySocket = (url = 'ws://localhost:8080') => {
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const backoffRef = useRef(1000);
  const isIntentionalClose = useRef(false);
  
  // Mutex lock to prevent React's double-mount from triggering race conditions
  const isConnecting = useRef(false);

  const connect = useCallback(() => {
    // If we are already in the process of connecting, exit immediately
    if (isConnecting.current) return;
    
    isConnecting.current = true;
    isIntentionalClose.current = false;
    setConnectionStatus('CONNECTING');

    console.log(`🔗 ATTEMPTING HANDSHAKE: ${url}`);
    const ws = new WebSocket(url);
    wsRef.current = ws;

   // In useTelemetrySocket.js
ws.onopen = () => {
  console.log('⚡ SCADA UPLINK ESTABLISHED ⚡');
  setConnectionStatus('CONNECTED');
  isConnecting.current = false; // Release lock
  useStore.getState().setSocket(ws);
};

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        useStore.getState().updateFromTelemetry(data);
      } catch (err) {
        console.error('❌ DATA CORRUPTION:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('⚠️ SCADA UPLINK FAULT');
      isConnecting.current = false;
      // Note: We don't call ws.close() here; the browser triggers onclose automatically
    };

    ws.onclose = (event) => {
      isConnecting.current = false;
      useStore.getState().setSocket(null);

      if (isIntentionalClose.current) {
        setConnectionStatus('DISCONNECTED');
        return;
      }

      setConnectionStatus('RECONNECTING');
      const delay = backoffRef.current;
      console.warn(`⚠️ UPLINK LOST (Code: ${event.code}). Retrying in ${delay}ms...`);
      
      // Exponential backoff to avoid hammering the server
      reconnectTimeoutRef.current = setTimeout(() => {
        backoffRef.current = Math.min(backoffRef.current * 1.5, 30000);
        connect();
      }, delay);
    };
  }, [url]);

  useEffect(() => {
    // Small delay to ensure the DOM is ready and prevent React Strict Mode double-mount issues
    const debounceTimer = setTimeout(connect, 250);

    return () => {
      isIntentionalClose.current = true;
      clearTimeout(debounceTimer);
      clearTimeout(reconnectTimeoutRef.current);
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return connectionStatus;
};