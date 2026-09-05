import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Database,
  FileSearch,
  Scale,
  Lightbulb,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  evidence?: {
    metric: string;
    value: string;
    context: string;
  }[];
  interpretation?: string;
  sourceReferences?: string[];
}

export const AIInsightsPage: React.FC = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Greetings. I am the VANVISION Administrative Decision-Support Copilot. I synthesize multi-district FRA cadastral telemetry, analyze committee processing backlogs, and explain deterministic anomalies across monitored tribal jurisdictions.',
      timestamp: 'Just now',
      evidence: [
        { metric: 'Monitored Coverage', value: '52 Districts across 5 States', context: 'ISFR 2021 & MoTA Schedule Framework' },
        { metric: 'Total Claims Registered', value: '45,520 Records', context: 'Synthetic Evaluation Fixture' },
        { metric: 'Active Anomalies', value: '468 Total (18 Critical)', context: 'Computed via Deterministic Rule Engine' },
      ],
      interpretation: 'System telemetry is synchronized. You can query specific district bottlenecks, cross-state Community Forest Rights (CFR) trends, or statutory SLA delay drivers.',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    'Why is Mandla classified as high risk?',
    'What are the biggest anomalies in Madhya Pradesh?',
    'Which districts require immediate attention?',
    'Summarize CFR claims status across Odisha and Chhattisgarh',
  ];

  const simulatedResponses: Record<
    string,
    {
      summary: string;
      evidence: { metric: string; value: string; context: string }[];
      interpretation: string;
      refs: string[];
    }
  > = {
    'Why is Mandla classified as high risk?': {
      summary: 'Mandla is classified as Critical Risk (82/100) due to statutory SDLC backlogs and parcel boundary variances.',
      evidence: [
        { metric: 'Statutory SLA Overdue', value: '183 Claims > 120 Days', context: 'Stalled at Bichhiya & Ghughri SDLCs without recorded minutes' },
        { metric: 'Max Area Mismatch', value: '+2.75 Ha Discrepancy', context: 'Claim FRA-MP-MAN-0194 exceeds revenue cadastral boundary' },
        { metric: 'Composite Risk Score', value: '82 / 100 (Critical Tier)', context: 'Ranked #3 nationally among 52 monitored districts' },
      ],
      interpretation:
        'The primary operational impediment is procedural stagnation at the Sub-Divisional Level Committee (SDLC) stage. Recommended administrative intervention: Issue a directed directive to the Sub-Divisional Officer (SDO) to table the 183 overdue files in an extraordinary committee sitting.',
      refs: ['District Mandla Profile', 'Claim FRA-MP-MAN-0194', 'Anomaly ANOM-MAN-0194-DLY'],
    },
    'What are the biggest anomalies in Madhya Pradesh?': {
      summary: 'Madhya Pradesh has 148 active anomalies concentrated across 7 priority forest districts.',
      evidence: [
        { metric: 'Mandla District', value: '82 Active Anomalies', context: 'Severe processing delays at SDLC level' },
        { metric: 'Balaghat District', value: '74 Active Anomalies', context: '47 land conflicts overlapping Kanha reserve buffer tract' },
        { metric: 'Chhindwara District', value: '62 Active Anomalies', context: 'Statistical area outliers in Tamia block exceeding 3.9 Ha' },
      ],
      interpretation:
        'The state exhibits a bifurcated challenge: procedural delays in Mandla versus spatial demarcation overlaps with protected forest reserves in Balaghat. A joint DGPS ground verification survey between Revenue and Forest departments is recommended for the Kanha fringe villages.',
      refs: ['MP State Synthesis', 'Balaghat RF-219 Buffer Report', 'Tamia Sub-Division MIS'],
    },
    'Which districts require immediate attention?': {
      summary: 'Top 3 districts flagged by the deterministic engine requiring State Level Monitoring Committee (SLMC) intervention:',
      evidence: [
        { metric: '1. West Singhbhum (JH)', value: 'Risk 86 / 100 (88 Anomalies)', context: 'Mining lease overlaps in Saranda Reserve Forest' },
        { metric: '2. Rayagada (OD)', value: 'Risk 84 / 100 (78 Anomalies)', context: 'Unverified customary CFR boundaries exceeding 1,800 Ha' },
        { metric: '3. Mandla (MP)', value: 'Risk 82 / 100 (82 Anomalies)', context: 'Procedural SDLC backlog affecting 183 tribal claimants' },
      ],
      interpretation:
        'These 3 districts represent over 45% of all critical severity flags nationally. Priority sequence: (1) Convene Jharkhand SLMC for Saranda boundary adjudication; (2) Facilitate inter-Gram Sabha customary boundary harmonization in Rayagada; (3) Enforce statutory SLA timelines in Mandla.',
      refs: ['National Priority Matrix', 'SLMC Advisory Docket (Prototype)'],
    },
    'Summarize CFR claims status across Odisha and Chhattisgarh': {
      summary: 'Community Forest Resource Rights (CFR under Section 3(1)(i)) constitute 42% of the active pipeline across OD and CG.',
      evidence: [
        { metric: 'Odisha CFR Volume', value: '3,840 Claims Registered', context: 'Rayagada, Mayurbhanj, Sundargarh customary tracts' },
        { metric: 'Chhattisgarh CFR Volume', value: '3,410 Claims Registered', context: 'Bastar, Dantewada, Kanker community forest zones' },
        { metric: 'Average Resolution Time', value: '142 Days', context: 'Requires multi-village customary consensus' },
      ],
      interpretation:
        'CFR claims demonstrate higher procedural longevity than individual IFR claims due to the statutory requirement for customary boundary demarcation and inter-village consensus. Accelerating titling requires institutionalizing joint Gram Sabha federation hearings.',
      refs: ['Odisha FRA Register', 'Chhattisgarh Tribal Welfare Directorate'],
    },
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      const match = simulatedResponses[query] || {
        summary: `Analysis for "${query}": Based on telemetry across 52 monitored districts, our pattern analysis detects consistent operational variance in SDLC committee review intervals and revenue boundary synchronization.`,
        evidence: [
          { metric: 'Evaluation Dataset', value: '52 Modeled Districts', context: 'Synthetic demonstration fixture' },
          { metric: 'Engine Status', value: 'Deterministic Classifier Active', context: 'PS-7 Rule System' },
        ],
        interpretation:
          'In production Phase 2, this copilot connects to indexed vector semantic retrieval (RAG) over scanned Gram Sabha resolutions, verified satellite boundary polygons, and Gazette records.',
        refs: ['VANVISION Cadastral Engine', 'FRA Section 3(1) Index'],
      };

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: match.summary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidence: match.evidence,
        interpretation: match.interpretation,
        sourceReferences: match.refs,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-5">
      {/* Notice Banner */}
      <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-forest-900">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-forest-700 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Administrative Decision-Support Copilot</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-200/80 text-emerald-900">
                PREVIEW / DEMO MODEL
              </span>
            </div>
            <p className="text-[11px] text-forest-800/90 mt-0.5">
              Provides structured decision support grounded in deterministic registry telemetry. Responses separate factual system evidence from cognitive interpretation.
            </p>
          </div>
        </div>
      </div>

      {/* Top Section: Executive Synthesis & Actionable Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* State-Level AI Summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bot className="w-4 h-4 text-forest-700" />
              <span>Multi-District Situational Synthesis</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Daily Digest</span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            <b className="text-rose-700">3 priority districts require immediate administrative intervention</b> this week due to statutory SLA breaches and forest corridor boundary disputes. Overall national title vesting rate remains steady at <b className="text-emerald-700">70.9%</b>, but median SDLC backlog has grown by <b className="text-amber-700">+8 days</b> in central forest corridors.
          </p>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Cadastral Data Completeness</span>
              <span className="font-bold font-mono text-slate-800">94.2%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-forest-700 w-[94%]" />
            </div>
          </div>
        </div>

        {/* Priority Recommendations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-700" />
              <span>Priority Decision Recommendations</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">SLMC Order of Action</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-lg flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-900">Review Severely Delayed Claims in Mandla</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Direct the Bichhiya SDLC to table 183 claims delayed past statutory 120-day limit.
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-900">Validate Land-Record Discrepancies in Balaghat</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Deploy joint Forest-Revenue DGPS survey to verify 47 Kanha buffer corridor claims.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Administrative Decision-Support Copilot Console */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-forest-850 text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Administrative Decision-Support Copilot</h3>
              <p className="text-[10px] text-slate-500">Query FRA telemetry, statutory backlogs, and anomaly causes</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Node Ready (Preview)
          </span>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-3xl rounded-xl p-4 space-y-3 ${
                  m.sender === 'user'
                    ? 'bg-forest-850 text-white rounded-br-none shadow-xs'
                    : 'bg-slate-50/90 text-slate-800 rounded-bl-none border border-slate-200 shadow-2xs'
                }`}
              >
                {/* Text summary */}
                <p className="whitespace-pre-line leading-relaxed font-medium">{m.text}</p>

                {/* Structured SYSTEM EVIDENCE Section */}
                {m.evidence && m.evidence.length > 0 && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                      <Database className="w-3 h-3 text-blue-600" />
                      <span>System Ground Evidence</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {m.evidence.map((ev, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                            {ev.metric}
                          </span>
                          <span className="font-mono font-bold text-slate-900 block mt-0.5">
                            {ev.value}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5 block leading-tight">
                            {ev.context}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Structured AI INTERPRETATION Section */}
                {m.interpretation && (
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/80 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200/60 pb-1">
                      <Lightbulb className="w-3 h-3 text-emerald-600" />
                      <span>Decision-Support Interpretation</span>
                    </div>
                    <p className="text-slate-800 text-[11px] leading-relaxed pt-0.5">
                      {m.interpretation}
                    </p>
                  </div>
                )}

                {/* Source References */}
                {m.sourceReferences && (
                  <div className="pt-1.5 border-t border-slate-200/80 text-[10px]">
                    <span className="font-semibold text-slate-400 block mb-1">Context References:</span>
                    <div className="flex flex-wrap gap-1">
                      {m.sourceReferences.map((ref, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">{m.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <Bot className="w-4 h-4 animate-bounce text-forest-700" />
              <span>Synthesizing cadastral evidence & generating decision briefing...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Suggested Briefings:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] font-medium text-slate-700 bg-white hover:bg-forest-50 hover:text-forest-900 border border-slate-200 hover:border-forest-400 rounded-full px-3 py-1 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask questions regarding district risk, claim backlogs, or spatial discrepancies..."
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-forest-700 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputPrompt.trim()}
            className="px-4 py-2 bg-forest-850 hover:bg-forest-900 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
