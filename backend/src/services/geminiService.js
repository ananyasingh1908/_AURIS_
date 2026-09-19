import { config } from '../config/env.js';

const AURIS_SYSTEM_PROMPT = `
You are the AURIS Sovereign Urban Intelligence Assistant — an advanced, autonomous multi-agent urban operating AI system designed for city administrators, municipal department engineers, and citizens.

Core Context & Principles of AURIS:
- AURIS is an Urban Intelligence platform, NOT a generic dashboard. Its purpose is connecting fragmented city signals, running multi-agent intelligence across departments, calculating transparent mathematical risk, and generating coordinated operational responses.
- Active Sovereign Jurisdiction: Global Network (Default: Mumbai, India).
- Core Incident Processing Flow:
  City Data / SCADA Telemetry → Incident Detection → Multi-Agent Analysis → Cross-Domain Correlation → Mathematical Risk Calculation → Recommended Department Actions → Response Dispatch.

Multi-Agent Neural Center (6 Domain Specialists):
1. Water Agent: SCADA pressure sensors, turbidity (NTU), chemical contamination, motorized isolation valves, rerouting bypasses.
2. Citizen Agent: NLP signal clustering, civic complaint verification, geo-targeted emergency advisories (e.g. Boil Water Notices).
3. Health Agent: Downstream hospital inpatient/outpatient ingress tracking (gastro/respiratory), medical supply buffers, IV hydration unit reserves.
4. Mobility Agent: Connected traffic signal override, dynamic Emergency Green Wave corridors for response vehicles, transit rerouting.
5. Environment Agent: Soil leaching models, coastal outfall monitoring, containment boom deployment, ecological buffer preservation.
6. Response / Decision Agent: Cross-department directive synthesis, SLA tracking, municipal work orders, multi-department executive coordination.

Canonical Active Project Incidents (Real Data):
1. Incident #INC-MUM-4012 / #INC-8492 (CRITICAL — Risk 95/100):
   - Type: Water Contamination & Toxic Backflow
   - Location: Bandra West, Ward H-West, Mumbai, India (19.0558°N, 72.8335°E)
   - Telemetry: Pressure collapse to 1.1 bar (baseline 3.8 bar), Turbidity spike to 14.2 NTU (WHO standard < 1.0 NTU), 38 verified citizen complaints.
   - Cross-Domain Impact: +42% gastro admissions at Lilavati, Bhabha, and Holy Family hospitals; Mahim Creek marine outfall 7 at risk of ecological leaching.
   - Mathematical Risk Formula: Base Severity (30) + Population Exposure (25) + Hospital Ingress (20) + Civic Signals (15) + Corridor Leaching (8) = 95/100 (CRITICAL).
   - Response Actions: Actuate motorized isolation valves V-104A/B, engage Emergency Green Wave Corridor #E-04 for 18 relief tankers, deploy absorbent booms at outfall 7, broadcast Boil Water Advisory via SMS to 42,000 residents.

2. Incident #INC-DEL-201 (HIGH — Risk 86/100):
   - Type: Najafgarh Road Waterlogging & Drainage Failure
   - Location: Najafgarh Road, Delhi, India.
   - Telemetry: Standing water 0.58m, discharge down 41%. Dewatering units deployed.

3. Incident #INC-DEL-118 (HIGH — Risk 76/100):
   - Type: Okhla AQI Surge & Industrial Emissions Spike
   - Location: Okhla Zone, Delhi, India.
   - Telemetry: PM2.5: 198 µg/m³, AQI: 182 trapped in inversion layer.

4. Incident #INC-BLR-221 (HIGH — Risk 80/100):
   - Type: Silk Board Traffic Gridlock & Transit Diversion
   - Location: Silk Board, Bengaluru, India.
   - Telemetry: Corridor speed 7.8 km/h, Ambulance delay +14 minutes.

5. Incident #INC-BLR-302 (CRITICAL — Risk 88/100):
   - Type: Bellandur Lake Overflow & Sewage Discharge
   - Location: Bellandur, Bengaluru, India.

City Health Index:
- Overall Index: 78/100 (Healthy Urban Baseline)
- Domains: Water (65/100), Mobility & Transit Flow (72/100), Air Quality & Emissions (58/100), Energy Grid (84/100), Waste (79/100), Public Safety (91/100).

Guidelines for Your Responses:
- Answer naturally, authoritatively, and concisely with clear markdown formatting (bolding, bullet points, headers).
- Use the actual AURIS data provided above whenever answering questions about incidents, departments, risk, or city health.
`;

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash-lite'
];

/**
 * Sovereign Fallback Generator when Gemini API is unreachable or key has issues
 */
const generateSovereignFallback = ({ message, context = {} }) => {
  const q = (message || '').toLowerCase();
  const city = context.city || 'Delhi';
  const role = context.role || 'City Administrator';

  if (q.includes('explain auris') || q.includes('what is auris') || q.includes('about auris')) {
    return `### **AURIS (Autonomous Urban Resilient Intelligence System)**

**AURIS** is a sovereign multi-agent urban operating intelligence platform designed for municipal commissioners, department engineers, and emergency responders in **${city}**.

---

#### 🧠 **Autonomous Multi-Agent Neural Architecture**
AURIS runs **6 domain-specialist AI agents**:
- 💧 **Water Agent**: Monitored SCADA pressure (bar), turbidity (NTU), and motorized valve isolation.
- 👥 **Citizen Agent**: NLP complaint clustering and geo-targeted citizen advisories (Boil Water Notices).
- 🏥 **Health Agent**: Downstream hospital ingress tracking and emergency medicine buffers.
- 🚦 **Mobility Agent**: Adaptive signal override and dynamic **Emergency Green Wave** corridors.
- 🌿 **Environment Agent**: Soil leaching models, coastal outfall monitoring, and AQI telematics.
- ⚡ **Decision Agent**: Cross-department work orders and multi-agency executive coordination.`;
  }

  if (q.includes('critical incident') || q.includes('active incident') || q.includes('incidents are active') || q.includes('what incidents')) {
    return `### 🚨 **Active Critical Incidents across ${city} & Network Nodes**

| Incident ID | Location & Domain | Risk Score | Key Telemetry / Status | Action Status |
| :--- | :--- | :--- | :--- | :--- |
| **#INC-8492** | Bandra West, Mumbai (Water) | **95/100 (CRITICAL)** | Pressure: 1.1 bar, Turbidity: 14.2 NTU | Isolation valves V-104A/B closed; Green Wave #E-04 active |
| **#INC-DEL-201** | Najafgarh Road, Delhi (Drainage) | **86/100 (HIGH)** | Standing water 0.58m, discharge down 41% | Dewatering pumps deployed |
| **#INC-DEL-118** | Okhla Zone, Delhi (Environment) | **76/100 (HIGH)** | PM2.5: 198 µg/m³, AQI: 182 | Emission throttles active |
| **#INC-BLR-221** | Silk Board, Bengaluru (Mobility) | **80/100 (HIGH)** | Speed: 7.8 km/h, Ambulance delay +14m | Adaptive signal timing engaged |
| **#INC-BLR-302** | Bellandur Lake, Bengaluru (Environment) | **88/100 (CRITICAL)** | Dissolved O₂ drop, sewage plume | Containment booms deployed |`;
  }

  if (q.includes('water incident') || q.includes('why is the water') || q.includes('high risk') || q.includes('risk formula') || q.includes('risk score')) {
    return `### 🔬 **Risk Breakdown: Incident #INC-8492 (Water Contamination & Pressure Loss)**

**Calculated Risk Score**: **95/100 (CRITICAL LEVEL)**

$$\\text{Risk Score} = \\text{Base Severity (30)} + \\text{Population Exposure (25)} + \\text{Hospital Ingress (20)} + \\text{Civic Signals (15)} + \\text{Corridor Leaching (8)} = 95/100$$

- **Pressure collapse**: 1.1 bar (nominal 3.8 bar)
- **Turbidity spike**: 14.2 NTU (WHO limit < 1.0 NTU)
- **Hospital impact**: +42% gastro surge at Lilavati, Bhabha, and Holy Family hospitals
- **Civic complaints**: 38 verified reports within 45 minutes
- **Ecological risk**: Mahim Creek marine outfall 7 potential leachate backflow`;
  }

  if (q.includes('department') || q.includes('who is affected') || q.includes('which department')) {
    return `### 🏢 **Multi-Department Incident Response Coordination**

AURIS coordinates active response across **6 municipal departments**:
- 💧 **Water Department**: Isolation valves V-104A/B closure and 18 relief tankers dispatched.
- 🚦 **Traffic Department**: Emergency Green Wave Corridor #E-04 overriding 14 traffic lights.
- 🏥 **Health Department**: Medical buffer release of 5,000 IV hydration units to downstream hospitals.
- 🌿 **Environment Department**: Absorbent booms deployed at outfall 7 to prevent toxic leachate.
- 👥 **Citizen Services**: Geo-targeted Boil Water Advisory SMS sent to 42,000 residents.`;
  }

  return `### **AURIS Sovereign Urban Intelligence**

**Operating Context**: Role: ${role} | Location: ${city} | City Health Index: **78/100**

- **Water Infrastructure**: SCADA monitors normal baseline; anomaly isolation protocols active.
- **Mobility Network**: Green Wave corridors configured for emergency priority transit.
- **Environmental Quality**: Atmospheric inversion and particulate dispersal models active.

*Ask any specific question about incidents, risk calculations, or multi-agency workflows.*`;
};

/**
 * Calls Gemini API with automatic fallback to sovereign multi-agent intelligence
 */
export const generateGeminiResponse = async ({ message, history = [], context = {} }) => {
  const apiKey = (config.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();

  // If no API key configured, use sovereign fallback immediately
  if (!apiKey) {
    return {
      reply: generateSovereignFallback({ message, context }),
      modelUsed: 'auris-sovereign-agent',
      finishReason: 'COMPLETE',
      timestamp: new Date().toISOString()
    };
  }

  // Format previous conversation turns for Gemini
  const formattedContents = [];

  if (Array.isArray(history)) {
    for (const turn of history) {
      if (turn.text && turn.sender) {
        const role = turn.sender === 'user' ? 'user' : 'model';
        formattedContents.push({
          role,
          parts: [{ text: turn.text }]
        });
      }
    }
  }

  // Build context augmentation if provided
  let userPrompt = message;
  if (context && (context.city || context.country || context.role || context.selectedIncident)) {
    const contextMeta = [
      context.role ? `User Role: ${context.role}` : null,
      context.city ? `Current City: ${context.city}` : null,
      context.country ? `Current Country: ${context.country}` : null,
      context.selectedIncident ? `Active Selected Incident: ${JSON.stringify(context.selectedIncident)}` : null
    ].filter(Boolean).join(' | ');

    userPrompt = `[Context: ${contextMeta}]\n\nUser Question: ${message}`;
  }

  formattedContents.push({
    role: 'user',
    parts: [{ text: userPrompt }]
  });

  // Try candidate models in order of priority
  for (const model of CANDIDATE_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: AURIS_SYSTEM_PROMPT }]
          },
          contents: formattedContents,
          generationConfig: {
            temperature: 0.4,
            topP: 0.95,
            maxOutputTokens: 8192
          }
        })
      });

      const data = await response.json();

      const candidate = data.candidates?.[0];
      if (response.ok && candidate?.content?.parts && candidate.content.parts.length > 0) {
        const fullReply = candidate.content.parts
          .map((p) => (typeof p === 'string' ? p : p.text || ''))
          .join('');

        if (fullReply && fullReply.trim()) {
          return {
            reply: fullReply.trim(),
            modelUsed: model,
            finishReason: candidate.finishReason || 'COMPLETE',
            timestamp: new Date().toISOString()
          };
        }
      }
    } catch (err) {
      console.warn(`[${model}] Attempt failed:`, err.message);
    }
  }

  // If external API attempts failed, return the sovereign fallback
  return {
    reply: generateSovereignFallback({ message, context }),
    modelUsed: 'auris-multi-agent-fallback',
    finishReason: 'COMPLETE',
    timestamp: new Date().toISOString()
  };
};
