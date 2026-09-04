import React, { useState } from 'react';
import { Sparkles, Send, Bot, AlertTriangle, ShieldCheck, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sourceReferences?: string[];
}

export const AIInsightsPage: React.FC = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Greetings. I am the VANVISION Decision Intelligence Assistant. I can synthesize multi-district FRA records, analyze administrative processing bottlenecks, and explain cadastral anomalies across monitored states.',
      timestamp: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    'Why is Mandla classified as high risk?',
    'What are the biggest anomalies in Madhya Pradesh?',
    'Which districts require immediate attention?',
    'Summarize CFR claims status across Odisha and Chhattisgarh',
  ];

  const simulatedResponses: Record<string, { answer: string; refs: string[] }> = {
    'Why is Mandla classified as high risk?': {
      answer:
        'District Mandla has a composite risk score of 82/100 (Critical). The classification is driven by two key factors:\n1. 183 claims have exceeded the statutory 120-day SLA processing threshold, remaining stalled at the Sub-Divisional Level Committee (SDLC) stage without recorded minutes.\n2. Several claims (notably FRA-MP-MAN-0194) exhibit significant land parcel discrepancies (+2.75 Ha) between physical FRC sketch demarcations and revenue cadastral records.',
      refs: ['District Mandla Profile', 'Claim FRA-MP-MAN-0194', 'Anomaly ANOM-2026-0801'],
    },
    'What are the biggest anomalies in Madhya Pradesh?': {
      answer:
        'In Madhya Pradesh, 148 active anomalies are currently flagged across 7 priority districts:\n• Mandla (82 anomalies): High concentration of processing delays at the Bichhiya and Ghughri SDLCs.\n• Balaghat (74 anomalies): 47 land boundary conflicts, specifically involving individual forest rights claims overlapping reserved buffer forest tracts in the Kanha ecosystem.\n• Chhindwara (62 anomalies): Statistical area outliers in Tamia block where claims exceed 3.9 Ha.',
      refs: ['MP State Synthesis', 'Balaghat RF-219 Buffer Report', 'Tamia Sub-Division MIS'],
    },
    'Which districts require immediate attention?': {
      answer:
        'The top 3 districts requiring immediate intervention by State Level Monitoring Committees (SLMC) are:\n1. West Singhbhum (Jharkhand) - Risk Score 86: 88 anomalies including active iron ore mining lease overlaps in Saranda Forest.\n2. Rayagada (Odisha) - Risk Score 84: 78 anomalies with unverified customary CFR boundaries exceeding 1,800 Ha.\n3. Mandla (Madhya Pradesh) - Risk Score 82: Severe SDLC processing backlog affecting 183 tribal claimants.',
      refs: ['Simulated Priority Matrix', 'Prototype Advisory Template'],
    },
    'Summarize CFR claims status across Odisha and Chhattisgarh': {
      answer:
        'Across Odisha and Chhattisgarh, Community Forest Resource Rights (CFRR under Section 3(1)(i)) represent 42% of all pending claims. In Odisha (Rayagada, Mayurbhanj, Sundargarh), title grant is delayed due to inter-Gram Sabha customary boundary harmonization. In Chhattisgarh (Bastar, Dantewada), security-related access limitations have postponed joint cadastral ground surveys for 32% of registered claims.',
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
        answer: `Simulated Analysis for "${query}": Based on the active telemetry across 52 monitored districts, our pattern analysis detects consistent operational variance in SDLC committee review intervals and revenue boundary synchronization. In Phase 2, this will execute indexed vector semantic retrieval over all scanned Gram Sabha resolutions and satellite boundary polygons.`,
        refs: ['VANVISION Mock Cadastral Engine', 'FRA Section 3(1) Index'],
      };

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: match.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceReferences: match.refs,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-300/80 rounded-xl flex items-center justify-between text-xs text-forest-900">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-forest-700 shrink-0" />
          <div>
            <span className="font-bold">AI Decision Support Engine (Phase 1 Preview)</span>
            <p className="text-[11px] text-forest-800/80 mt-0.5">
              Demonstrating intended cognitive workflow. Production LLM, RAG indexing of Gram Sabha resolutions, and spatial anomaly explanations will connect to evaluated backend in Phase 2.
            </p>
          </div>
        </div>
        <span className="px-2 py-1 rounded bg-forest-800 text-white font-mono font-bold text-[10px] shrink-0">
          PREVIEW / DEMO MODEL
        </span>
      </div>

      {/* Top Section: Executive Synthesis & Actionable Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* State-Level AI Summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bot className="w-4 h-4 text-forest-700" />
              <span>Multi-State Administrative Synthesis</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Automated Daily Digest</span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            <b className="text-rose-700">3 priority districts require immediate administrative intervention</b> this week due to composite SLA breaches and high-risk boundary disputes. 
            Overall national title vesting rate remains steady at <b className="text-emerald-700">72.1%</b>, but median SDLC backlog has grown by <b className="text-amber-700">+8 days</b> in central forest corridors.
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
            <span className="text-[10px] font-mono text-slate-400">SLMC Action Order</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 bg-rose-50/60 border border-rose-200 rounded-lg flex items-start gap-2.5">
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

            <div className="p-2.5 bg-orange-50/60 border border-orange-200 rounded-lg flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-900">Validate Land-Record Discrepancies in Balaghat</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Deploy joint Forest-Revenue DGPS survey to verify 47 Kanha buffer corridor claims.
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-semibold text-slate-900">Audit Submission Spike in Mayurbhanj</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Spot-verify Gram Sabha resolution quorums for 64 rapid CFR filings in Baripada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive "Ask VANVISION" Chat Console */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[480px]">
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-forest-800 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Ask VANVISION Intelligence Copilot</h3>
              <p className="text-[10px] text-slate-500">Natural language decision support over mock FRA database</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Node Ready
          </span>
        </div>

        {/* Message History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl rounded-xl p-3.5 ${
                  m.sender === 'user'
                    ? 'bg-forest-850 text-white rounded-br-none shadow-xs'
                    : 'bg-slate-100/90 text-slate-800 rounded-bl-none border border-slate-200'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                {m.sourceReferences && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-[10px]">
                    <span className="font-bold text-slate-500 block mb-1">Demonstration Context References:</span>
                    <div className="flex flex-wrap gap-1">
                      {m.sourceReferences.map((ref, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono">
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <Bot className="w-4 h-4 animate-bounce text-forest-700" />
              <span>Analyzing cadastral records & generating response...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] font-medium text-slate-700 bg-white hover:bg-forest-50 hover:text-forest-900 border border-slate-200 hover:border-forest-400 rounded-full px-3 py-1 whitespace-nowrap transition-colors shrink-0"
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
            className="px-4 py-2 bg-forest-850 hover:bg-forest-900 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
