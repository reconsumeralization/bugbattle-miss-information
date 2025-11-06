// Real-time misinformation alerts with structured outputs
import XaiApi from '../../../lib/xaiApi';

const xaiApi = new XaiApi();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { severity = 'all', limit = 3 } = req.query;

    const alerts = await xaiApi.getEmergingAlertsStructured();

    // Filter by severity if specified
    let filteredAlerts = alerts.alerts;
    if (severity !== 'all') {
      filteredAlerts = alerts.alerts.filter(alert => 
        alert.alert_level.toLowerCase() === severity.toLowerCase()
      );
    }

    // Limit results
    if (limit && parseInt(limit) > 0) {
      filteredAlerts = filteredAlerts.slice(0, parseInt(limit));
    }

    // Enhance alerts with additional context
    const enhancedAlerts = filteredAlerts.map(alert => ({
      ...alert,
      severity_score: getSeverityScore(alert.alert_level),
      response_urgency: getResponseUrgency(alert),
      educational_opportunity: getEducationalValue(alert),
      trending_keywords: extractKeywords(alert.narrative)
    }));

    res.status(200).json({
      alerts: enhancedAlerts,
      platform_health: {
        overall_score: alerts.platform_health_score || 75,
        threat_level: getOverallThreatLevel(enhancedAlerts),
        monitoring_status: 'active'
      },
      metadata: {
        timestamp: alerts.timestamp || new Date().toISOString(),
        total_alerts: filteredAlerts.length,
        severity_filter: severity,
        api_version: 'enhanced-structured'
      }
    });

  } catch (error) {
    console.error('Real-time alerts error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch alerts',
      details: error.message,
      fallback_data: {
        alerts: [],
        platform_health: { overall_score: 50, threat_level: 'UNKNOWN' }
      }
    });
  }
}

// Helper functions
function getSeverityScore(alertLevel) {
  const scores = {
    'CRITICAL': 90,
    'HIGH': 70,
    'MEDIUM': 50,
    'LOW': 30
  };
  return scores[alertLevel] || 50;
}

function getResponseUrgency(alert) {
  const urgencyMap = {
    'CRITICAL': 'IMMEDIATE',
    'HIGH': 'WITHIN_HOUR', 
    'MEDIUM': 'WITHIN_DAY',
    'LOW': 'ROUTINE'
  };
  return urgencyMap[alert.alert_level] || 'ROUTINE';
}

function getEducationalValue(alert) {
  // Determine educational value based on topic and narrative
  const highValueTopics = ['health', 'climate', 'democracy', 'technology'];
  const isHighValue = highValueTopics.some(topic => 
    alert.topic.toLowerCase().includes(topic) || 
    alert.narrative.toLowerCase().includes(topic)
  );
  
  return {
    priority: isHighValue ? 'HIGH' : 'MEDIUM',
    target_audience: getTargetAudience(alert),
    key_teaching_points: generateTeachingPoints(alert)
  };
}

function getTargetAudience(alert) {
  // Simple audience detection based on narrative content
  const narrative = alert.narrative.toLowerCase();
  
  if (narrative.includes('youth') || narrative.includes('students')) return 'students';
  if (narrative.includes('parent') || narrative.includes('family')) return 'families';
  if (narrative.includes('senior') || narrative.includes('elderly')) return 'seniors';
  
  return 'general_public';
}

function generateTeachingPoints(alert) {
  return [
    `Understanding ${alert.topic} misinformation patterns`,
    'Source verification techniques',
    'Critical thinking strategies',
    'How to identify emotional manipulation'
  ];
}

function extractKeywords(narrative) {
  // Extract potential trending keywords from narrative
  const words = narrative.split(' ').filter(word => word.length > 4);
  return words.slice(0, 5); // Return first 5 meaningful words
}

function getOverallThreatLevel(alerts) {
  if (alerts.length === 0) return 'LOW';
  
  const criticalCount = alerts.filter(a => a.alert_level === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.alert_level === 'HIGH').length;
  
  if (criticalCount > 0) return 'CRITICAL';
  if (highCount > 1) return 'HIGH';
  if (alerts.length > 2) return 'MEDIUM';
  
  return 'LOW';
}

export const config = {
  api: {
    responseLimit: '2mb',
  },
}; 