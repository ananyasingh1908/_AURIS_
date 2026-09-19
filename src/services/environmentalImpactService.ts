import { Incident } from '../types';

export interface EnvironmentalImpactMetric {
  label: string;
  value: string;
  unit: string;
  caption: string;
}

const severityFactorMap: Record<string, number> = {
  Critical: 1.5,
  Warning: 1.1,
  Normal: 0.8,
  Resolved: 0.35,
  'AI Predicted': 1.2
};

const getSeverityFactor = (incident: Incident) => severityFactorMap[incident.severity] ?? 1;

export const calculateEnvironmentalImpact = (incident: Incident): EnvironmentalImpactMetric[] => {
  const population = Math.max(incident.affectedPopulation || 1000, 1000);
  const severityMultiplier = getSeverityFactor(incident);

  if (
    incident.category === 'Water' ||
    incident.category === 'Flooding' ||
    incident.category === 'Citizen Report'
  ) {
    const litersAffected = Math.round(population * 135 * 0.6 * severityMultiplier);
    const householdsAffected = Math.round(litersAffected / (135 * 4));

    return [
      {
        label: 'Estimated clean water affected',
        value: `${litersAffected.toLocaleString()}`,
        unit: 'L/day',
        caption: 'Estimated using India household water use benchmark of ~135 L/person/day and 4-person household assumptions.'
      },
      {
        label: 'Equivalent households affected',
        value: `${householdsAffected.toLocaleString()}`,
        unit: 'homes',
        caption: 'Estimated as liters affected ÷ 135 L/person/day ÷ 4 people per household.'
      }
    ];
  }

  if (incident.category === 'Mobility' || incident.category === 'Infrastructure' || incident.category === 'Public Safety') {
    const extraIdleMinutes = Math.round(population * 0.12 * severityMultiplier);
    const fuelLitersBurned = Math.round((extraIdleMinutes / 60) * 1.5 * 10) / 10;
    const co2Kg = Math.round(fuelLitersBurned * 2.3 * 10) / 10;

    return [
      {
        label: 'Estimated idle-traffic CO₂',
        value: `${co2Kg.toLocaleString()}`,
        unit: 'kg CO₂',
        caption: 'Estimated using ~2.3 kg CO₂ emitted per litre of petrol burned and ~1.5 L/hour idling for urban traffic congestion.'
      },
      {
        label: 'Delay burden',
        value: `${extraIdleMinutes.toLocaleString()}`,
        unit: 'vehicle-minutes',
        caption: 'Estimated as extra idling time tied to the affected population and incident severity.'
      }
    ];
  }

  if (
    incident.category === 'Environment' ||
    incident.category === 'Health' ||
    incident.category === 'AI Predicted Risk' ||
    incident.category === 'Climate / Carbon'
  ) {
    const exposedPopulation = Math.round(population * (incident.severity === 'Critical' ? 0.46 : incident.severity === 'Warning' ? 0.3 : 0.2));
    const estimatedExposureHours = Math.round(exposedPopulation * 5.5);

    return [
      {
        label: 'Estimated exposure burden',
        value: `${exposedPopulation.toLocaleString()}`,
        unit: 'people',
        caption: 'Estimated using standard WHO-style exposure assumptions for near-source PM / AQI and short-duration health impact windows.'
      },
      {
        label: 'At-risk exposure hours',
        value: `${estimatedExposureHours.toLocaleString()}`,
        unit: 'person-hours',
        caption: 'Estimated as exposed people × 5.5 hours of elevated exposure in the affected zone.'
      }
    ];
  }

  const generalExposure = Math.round(population * (incident.severity === 'Critical' ? 0.38 : incident.severity === 'Warning' ? 0.24 : 0.14));

  return [
    {
      label: 'Estimated affected population',
      value: `${generalExposure.toLocaleString()}`,
      unit: 'people',
      caption: 'Estimated using direct incident reach, population density, and severity weighting to approximate secondary exposure.'
    }
  ];
};
