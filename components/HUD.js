import React from 'react';
import styles from './HUD.module.css';


export default function HUD({ speed = 0, inventory = [null, null, null] }) {
  const displaySpeed = Math.round(speed * 3.6); // convert m/s to km/h as an example

  return (
    <div className={styles['hud-container']}>
      <div className={styles['hud-speed']}>
        {displaySpeed} km/h
      </div>

      <div className={styles['hud-inventory']}>
        {inventory.map((item, idx) => (
          <div key={idx} className={styles['hud-slot']}>
            {item ? <img src={item.icon} alt={`Item ${idx}`} /> : <span className={styles['empty-slot']}></span>}
          </div>
        ))}
      </div>
    </div>
  );
} 