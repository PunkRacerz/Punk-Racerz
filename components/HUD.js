import React from 'react';
import styles from './HUD.module.css';


export default function HUD({ speed = 0, inventory = [null, null, null], lap = 1, totalLaps = 3 }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: 20,
      color: '#ff66cc', // Neon pink
      fontFamily: '"Share Tech Mono", monospace',
      background: 'rgba(0, 0, 0, 0.85)',
      padding: '1rem 1.5rem',
      borderRadius: '1rem',
      border: '2px solid #ff00aa',
      boxShadow: '0 0 10px #ff00aa, 0 0 20px #ff00aa',
      zIndex: 1000,
      width: 240,
      backdropFilter: 'blur(6px)'
    }}>
      <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
        🏁 LAP <span style={{ color: '#ffffff' }}>{lap}</span>/<span style={{ color: '#ffffff' }}>{totalLaps}</span>
      </div>
      <div style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
        🚀 SPEED <span style={{ color: '#ffffff' }}>{speed.toFixed(1)}</span> u/s
      </div>
      <div style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>🎒 INVENTORY</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {inventory.map((item, i) => (
          <li key={i} style={{ color: item ? '#ffffff' : '#555', paddingBottom: '0.3rem' }}>
            {item ?? '—'}
          </li>
        ))}
      </ul>
    </div>
  );
}