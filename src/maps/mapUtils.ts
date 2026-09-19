import L from 'leaflet';
import { IncidentSeverity, CarbonProjectType } from '../types';

export const createSeverityIcon = (severity: IncidentSeverity, isSelected = false) => {
  let bgColor = '#0284C7'; // Normal blue
  let ringColor = 'rgba(2, 132, 199, 0.3)';
  let pulseClass = '';

  if (severity === 'Critical') {
    bgColor = '#EF4444';
    ringColor = 'rgba(239, 68, 68, 0.4)';
    pulseClass = 'pulse-critical';
  } else if (severity === 'Warning') {
    bgColor = '#F59E0B';
    ringColor = 'rgba(245, 158, 11, 0.4)';
  } else if (severity === 'Resolved') {
    bgColor = '#10B981';
    ringColor = 'rgba(16, 185, 129, 0.3)';
  } else if (severity === 'AI Predicted') {
    bgColor = '#8B5CF6';
    ringColor = 'rgba(139, 92, 246, 0.4)';
    pulseClass = 'pulse-ai-agent';
  }

  const size = isSelected ? 38 : 28;
  const innerDot = isSelected ? 16 : 10;

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
      <div class="${pulseClass}" style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: ${ringColor};
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      "></div>
      <div style="
        width: ${innerDot}px;
        height: ${innerDot}px;
        border-radius: 50%;
        background-color: ${bgColor};
        border: 2px solid #ffffff;
        z-index: 2;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-auris-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

export const createCarbonProjectIcon = (type: CarbonProjectType, isSelected = false) => {
  const size = isSelected ? 36 : 28;
  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgba(16, 185, 129, 0.25);
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      "></div>
      <div style="
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #059669;
        border: 2px solid #ffffff;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-auris-carbon-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

export const createDraggableCitizenPin = () => {
  const html = `
    <div style="position: relative; width: 36px; height: 44px; display: flex; flex-direction: column; align-items: center; cursor: grab;">
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: linear-gradient(135deg, #0284C7, #0369A1);
        border: 3px solid #ffffff;
        box-shadow: 0 8px 16px rgba(2, 132, 199, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 10px; height: 10px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
      </div>
      <div style="
        width: 12px;
        height: 4px;
        background: rgba(0,0,0,0.25);
        border-radius: 50%;
        margin-top: 4px;
        filter: blur(1px);
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-citizen-pin',
    iconSize: [36, 44],
    iconAnchor: [18, 40],
    popupAnchor: [0, -40]
  });
};
