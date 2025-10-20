import React from 'react';
import Terminal from '../components/Terminal';

function Connect() {
  const handleData = (data: string) => {
    console.log('Terminal input:', data);
  };

  const handleKey = (key: string) => {
    console.log('Key pressed:', key);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1e1e1e',
      }}
    >
      <div
        style={{
          padding: '16px',
          backgroundColor: '#2d2d2d',
          borderBottom: '1px solid #404040',
          color: '#ffffff',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '18px' }}>
          Network Topology Connect
        </h2>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#cccccc' }}>
          Terminal interface for network topology management
        </p>
      </div>

      <div
        style={{
          flex: 1,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Terminal
          className="connect-terminal"
          onData={handleData}
          onKey={handleKey}
        />
      </div>
    </div>
  );
}

export default Connect;
