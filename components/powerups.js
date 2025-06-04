import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const POWER_UPS = {
  spark: {
    symbol: '⚡',
    activate: (orbCount, mesh) => {
      const intensity = orbCount * 2;
      mesh.material.emissiveIntensity = intensity;
      mesh.scale.set(1 + orbCount * 0.3, 1 + orbCount * 0.3, 1 + orbCount * 0.3);
    },
  },
  glitchfang: {
    symbol: '🌀',
    activate: (orbCount, mesh) => {
      mesh.rotationSpeed = orbCount * 0.1;
    },
  },
  nova13: {
    symbol: '🛡️',
    activate: (orbCount, mesh) => {
      mesh.material.color.set('skyblue');
      mesh.material.opacity = 0.5 + 0.1 * orbCount;
    },
  },
  venoma: {
    symbol: '☣️',
    activate: (orbCount, mesh) => {
      mesh.material.color.set('green');
      mesh.material.opacity = 0.4 + orbCount * 0.2;
    },
  },
  blizzardexe: {
    symbol: '❄️',
    activate: (orbCount, mesh) => {
      mesh.material.color.set('#00f5ff');
      mesh.material.opacity = 0.3 + orbCount * 0.2;
    },
  },
  scrapdrift: {
    symbol: '🔧',
    activate: (orbCount, mesh) => {
      mesh.material.color.set('orange');
      mesh.rotationSpeed = orbCount * 0.05;
    },
  },
  eclipse9: {
    symbol: '🌑',
    activate: (orbCount, mesh) => {
      mesh.material.color.set('black');
      mesh.material.emissive.set('#ff0033');
    },
  },
  aetherx: {
    symbol: '🌪️',
    activate: (orbCount, mesh) => {
      mesh.rotationSpeed = 0.1 * orbCount;
      mesh.material.emissiveIntensity = orbCount;
    },
  },
  zosi: {
    symbol: '🧬',
    activate: (orbCount, mesh) => {
      mesh.material.color.set('#cc00ff');
      mesh.scale.set(1 + orbCount * 0.2, 1 + orbCount * 0.2, 1 + orbCount * 0.2);
    },
  },
  solstice: {
    symbol: '☀️',
    activate: (orbCount, mesh) => {
      mesh.material.emissive.set('#ffff99');
      mesh.material.emissiveIntensity = orbCount * 0.8;
    },
  },
  razorbyte: {
    symbol: '💢',
    activate: (orbCount, mesh) => {
      mesh.material.color.set('red');
      mesh.scale.set(1.2 + orbCount * 0.1, 1.2 + orbCount * 0.1, 1.2 + orbCount * 0.1);
    },
  },
  ignisvyre: {
    symbol: '🔥',
    activate: (orbCount, mesh) => {
      mesh.material.emissive.set('orange');
      mesh.material.emissiveIntensity = orbCount * 1.2;
    },
  },
};

export const powerUpSymbols = Object.fromEntries(
  Object.entries(POWER_UPS).map(([key, val]) => [key, val.symbol])
);

export default function PowerUpEffect({ racerId, orbCount, meshRef }) {
    useFrame(() => {
      const config = POWER_UPS[racerId?.toLowerCase()];
      const root = meshRef.current;
  
      if (!config || !root) return;
  
      // 🔍 Find the first mesh inside the group (non-destructive)
      let targetMesh = null;
  
      root.traverse?.((child) => {
        if (!targetMesh && child.isMesh) {
          targetMesh = child;
        }
      });
  
      if (targetMesh && targetMesh.material) {
        config.activate(orbCount, targetMesh);
      }
    });
  
    return null;
  }