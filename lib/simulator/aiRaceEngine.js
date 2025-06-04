export const trackLength = 300; // meters per lap
export const totalLaps = 3;

// Converts race distance into an interpolated point on the 3D track
export function getTrackPointAtDistance(trackPoints, distance) {
    let accumulated = 0;
    for (let i = 0; i < trackPoints.length - 1; i++) {
      const p1 = trackPoints[i];
      const p2 = trackPoints[i + 1];
      const segmentLength = Math.sqrt(
        (p2.x - p1.x) ** 2 +
        (p2.y - p1.y) ** 2 +
        (p2.z - p1.z) ** 2
      );
  
      if (accumulated + segmentLength >= distance) {
        const t = (distance - accumulated) / segmentLength;
        return {
          x: p1.x + (p2.x - p1.x) * t,
          y: p1.y + (p2.y - p1.y) * t,
          z: p1.z + (p2.z - p1.z) * t,
        };
      }
  
      accumulated += segmentLength;
    }
  
    return trackPoints[trackPoints.length - 1];
  }
  
  // AI Racer Template
  export function createRacers() {
    return [
      { name: 'Spark', baseSpeed: 48, acceleration: 6, grip: 7, aggression: 9, consistency: 5, position: 0, velocity: 0, lap: 1, crashed: false, mesh: null },
      { name: 'GlitchFang', baseSpeed: 50, acceleration: 8, grip: 5, aggression: 10, consistency: 4, position: 0, velocity: 0, lap: 1, crashed: false, mesh: null },
      { name: 'Nova-13', baseSpeed: 46, acceleration: 5, grip: 9, aggression: 4, consistency: 10, position: 0, velocity: 0, lap: 1, crashed: false, mesh: null },
      { name: 'Venoma', baseSpeed: 51, acceleration: 7, grip: 6, aggression: 8, consistency: 6, position: 0, velocity: 0, lap: 1, crashed: false, mesh: null },
      { name: 'Blizzard.EXE', baseSpeed: 47, acceleration: 5, grip: 8, aggression: 3, consistency: 9, position: 0, velocity: 0, lap: 1, crashed: false, mesh: null },
      { name: 'ScrapDrift', baseSpeed: 60, acceleration: 10, grip: 6, aggression: 2, consistency: 7, position: 0, velocity: 0, lap: 1, crashed: false, mesh: null },
      { name: 'Eclipse.9', baseSpeed: 53, acceleration: 7, grip: 9, aggression: 1, consistency: 10, position: 0, velocity: 0, lap: 1, crashed: false, mesh: null },
      { name: 'Aether-X', baseSpeed: 52, acceleration: 8, grip: 6, aggression: 3, consistency: 5, position: 0, velocity: 0, lap: 1, crashed: false, mesh: null },
      { name: 'Solstice', baseSpeed: 49, acceleration: 6, grip: 8, aggression: 5, consistency: 8, position: 0, velocity: 0, lap: 1, crashed: false, mesh: null },
    ];
  }
  
  // One tick of simulation
  export function simulateTick(racers) {
    racers.forEach(racer => {
      if (racer.crashed) return;
  
      const randFactor = (Math.random() - 0.5) * (1 - racer.consistency / 10);
      const accelBoost = (racer.acceleration / 10) + randFactor;
      const maxSpeed = racer.baseSpeed * (1 + (racer.aggression - 5) * 0.01);
      racer.velocity += accelBoost;
  
      if (racer.velocity > maxSpeed) {
        racer.velocity = maxSpeed;
      }
  
      // Risky AI may crash
      const crashChance = (1 - racer.consistency / 10) * 0.01;
      if (Math.random() < crashChance) {
        racer.velocity *= 0.5;
        if (Math.random() < 0.3) {
          racer.crashed = true;
          racer.velocity = 0;
          return;
        }
      }
  
      racer.position += racer.velocity;
  
      // Lap update
      if (racer.position >= trackLength * racer.lap) {
        racer.lap += 1;
      }
    });
  
    // Sort by progress
    racers.sort((a, b) => (b.lap * trackLength + b.position) - (a.lap * trackLength + a.position));
  }
  
  // Applies mesh positions based on race progress
  export function setMeshPositions(racers, trackPoints) {
    racers.forEach(racer => {
      if (!racer.mesh || racer.crashed) return;
  
      const totalDistance = (racer.lap - 1) * trackLength + racer.position;
      const pos = getTrackPointAtDistance(trackPoints, totalDistance);
  
      if (pos) {
        racer.mesh.position.set(pos.x, pos.y, pos.z);
      }
    });
  }
  
  // Full race simulator
  export function runFullRace(maxTicks = 3000) {
    const racers = createRacers();
    let tick = 0;
    const history = [];
  
    while (tick < maxTicks && !racers.some(r => r.lap > totalLaps)) {
      simulateTick(racers);
      history.push(JSON.parse(JSON.stringify(racers))); // Deep copy per tick
      tick++;
    }
  
    const winner = racers.find(r => r.lap > totalLaps);
    return {
      winner: winner?.name || null,
      history,
      ticks: tick,
    };
  }