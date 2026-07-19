import { v4 as uuidv4 } from 'uuid';
import { Alert, Metric } from './types';

const alerts: Map<string, Alert> = new Map();

export function createAlert(
  name: string,
  metric: string,
  threshold: number,
  condition: 'above' | 'below'
): Alert {
  const alert: Alert = {
    id: uuidv4(),
    name,
    metric,
    threshold,
    condition,
    triggered: false,
  };

  alerts.set(alert.id, alert);
  console.log(`alert created: ${name} — ${metric} ${condition} ${threshold}`);
  return alert;
}

export function checkAlerts(metric: Metric): Alert[] {
  const triggered: Alert[] = [];

  for (const alert of alerts.values()) {
    if (alert.metric !== metric.name) continue;

    const shouldTrigger =
      alert.condition === 'above'
        ? metric.value > alert.threshold
        : metric.value < alert.threshold;

    if (shouldTrigger && !alert.triggered) {
      alert.triggered = true;
      alert.triggeredAt = new Date().toISOString();
      alert.value = metric.value;
      triggered.push(alert);
      console.log(`🚨 alert triggered: ${alert.name} — ${metric.name} is ${metric.value} (threshold: ${alert.threshold})`);
    } else if (!shouldTrigger && alert.triggered) {
      // auto-resolve when metric goes back to normal
      alert.triggered = false;
      alert.triggeredAt = undefined;
      console.log(`✅ alert resolved: ${alert.name}`);
    }
  }

  return triggered;
}

export function getAlerts(): Alert[] {
  return Array.from(alerts.values());
}

export function deleteAlert(id: string): boolean {
  return alerts.delete(id);
}