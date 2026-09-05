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
  Lightbulb,
  Cpu,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { queryDecisionSupportAI, generateDeterministicExplanation, GroundedEvidenceItem } from '../services/aiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  evidence?: GroundedEvidenceItem[];
  interpretation?: string;
  sourceReferences?: string[];
  isLiveAI?: boolean;
  provider?: string;
  offlineReason?: string;
}

export const AIInsightsPage: React.FC = () => {
  const { settings } = useSettings();
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
      isLiveAI: false,
      provider: 'Deterministic System Explanation (Rule Engine Baseline)',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const isGeminiConfigured = Boolean(
    (settings.aiApiKey && settings.aiApiKey.trim()) ||
    (import.meta.env.VITE_GEMINI_API_KEY && (import.meta.env.VITE_GEMINI_API_KEY as string).trim())
  );

  const samplePrompts = [
    'Why is Mandla classified as high risk?',
    'What are the biggest anomalies in the queue?',
    'Which districts require immediate attention?',
    'Summarize CFR claims status and SLA compliance',
  ];

  const handleSend = async (textToSend?: string) => {
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

    try {
      const response = await queryDecisionSupportAI(query, settings.aiApiKey, {
        maxProcessingDays: settings.maxProcessingDays,
        landVarianceTolerancePct: settings.landVarianceTolerance,
        autoFlagSpikes: settings.autoFlagSpikes,
      });

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: response.summary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidence: response.evidence,
        interpretation: response.interpretation,
        sourceReferences: response.sourceReferences,
        isLiveAI: response.isLiveAI,
        provider: response.provider,
        offlineReason: response.offlineReason,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallback = generateDeterministicExplanation(query, {
        maxProcessingDays: settings.maxProcessingDays,
        landVarianceTolerancePct: settings.landVarianceTolerance,
        autoFlagSpikes: settings.autoFlagSpikes,
      });

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: fallback.summary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidence: fallback.evidence,
        interpretation: fallback.interpretation,
        sourceReferences: fallback.sourceReferences,
        isLiveAI: false,
        provider: 'Deterministic System Explanation (Rule Engine Fallback)',
        offlineReason: 'Connection to live AI provider failed. Provided transparent deterministic rule-engine response.',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Notice Banner */}
      <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-forest-900 dark:text-emerald-200">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-forest-700 dark:text-emerald-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold">Administrative Decision-Support Copilot</span>
              {isGeminiConfigured ? (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-950 dark:text-emerald-200 border border-emerald-400/50 flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5" />
                  CONNECTED AI (Gemini 1.5 Flash)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-200/80 dark:bg-amber-900/80 text-amber-950 dark:text-amber-200 border border-amber-400/50 flex items-center gap-1">
                  <Database className="w-2.5 h-2.5" />
                  DETERMINISTIC RULE ENGINE (Offline Fallback)
                </span>
              )}
            </div>
            <p className="text-[11px] text-forest-800/90 dark:text-emerald-300/80 mt-0.5">
              Grounded decision support strictly referencing VANVISION cadastral telemetry. Separates factual system ground evidence from administrative interpretation.
            </p>
          </div>
        </div>

        <Link
          to="/settings"
          className="shrink-0 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-emerald-300 dark:border-emerald-800/80 text-[11px] font-semibold text-emerald-850 dark:text-emerald-300 flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>{isGeminiConfigured ? 'Configure AI Key' : 'Connect Gemini API Key'}</span>
        </Link>
      </div>

      {/* Top Section: Executive Synthesis & Actionable Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* State-Level AI Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bot className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
              <span>Multi-District Situational Synthesis</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Evaluation Synthesis</span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <b className="text-rose-700 dark:text-rose-400">3 priority districts require immediate administrative intervention</b> this week due to statutory SLA breaches and forest corridor boundary disputes. Overall national title vesting rate remains steady at <b className="text-emerald-700 dark:text-emerald-400">70.9%</b>, but median SDLC backlog has grown by <b className="text-amber-700 dark:text-amber-400">+8 days</b> in central forest corridors.
          </p>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Cadastral Data Completeness</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">94.2%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-forest-700 dark:bg-emerald-500 w-[94%]" />
            </div>
          </div>
        </div>

        {/* Priority Recommendations */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
              <span>Priority Decision Recommendations</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">SLMC Order of Action</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-lg flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Review Severely Delayed Claims in Mandla</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Direct the Bichhiya SDLC to table 183 claims delayed past statutory 120-day limit.
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-lg flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Validate Land-Record Discrepancies in Balaghat</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Deploy joint Forest-Revenue DGPS survey to verify 47 Kanha buffer corridor claims.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Administrative Decision-Support Copilot Console */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col h-[560px]">
        {/* Chat Header */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:bg-[#0c1626] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-forest-850 dark:bg-emerald-950 text-white dark:text-emerald-300 border border-transparent dark:border-emerald-800/50">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Administrative Decision-Support Copilot</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Query FRA telemetry, statutory backlogs, and anomaly causes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
              isGeminiConfigured
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}>
              {isGeminiConfigured ? 'Gemini 1.5 Active' : 'Deterministic Mode'}
            </span>
          </div>
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
                    : 'bg-slate-50/90 dark:bg-[#111c2e] text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-800 shadow-2xs'
                }`}
              >
                {/* Generation Origin Badge */}
                {m.sender === 'assistant' && (
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800 text-[10px]">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Analysis Engine:</span>
                    <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[9px] border ${
                      m.isLiveAI
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    }`}>
                      {m.provider || 'Deterministic System Explanation'}
                    </span>
                  </div>
                )}

                {/* Text summary */}
                <p className="whitespace-pre-line leading-relaxed font-medium">{m.text}</p>

                {/* Offline Warning Notice if applicable */}
                {m.offlineReason && (
                  <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300">
                    ℹ️ {m.offlineReason}
                  </div>
                )}

                {/* Structured SYSTEM EVIDENCE Section */}
                {m.evidence && m.evidence.length > 0 && (
                  <div className="p-3 bg-white dark:bg-slate-900/90 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                      <Database className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span>System Ground Evidence</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {m.evidence.map((ev, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-800/70 rounded border border-slate-100 dark:border-slate-700/60">
                          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase block truncate">
                            {ev.metric}
                          </span>
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block mt-0.5">
                            {ev.value}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-tight">
                            {ev.context}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Structured DECISION SUPPORT INTERPRETATION Section */}
                {m.interpretation && (
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-lg border border-emerald-200/80 dark:border-emerald-800/60 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 border-b border-emerald-200/60 dark:border-emerald-800/60 pb-1">
                      <Lightbulb className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Decision-Support Recommendation</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 text-[11px] leading-relaxed pt-0.5">
                      {m.interpretation}
                    </p>
                  </div>
                )}

                {/* Source References */}
                {m.sourceReferences && m.sourceReferences.length > 0 && (
                  <div className="pt-1.5 border-t border-slate-200/80 dark:border-slate-800 text-[10px]">
                    <span className="font-semibold text-slate-400 dark:text-slate-500 block mb-1">Telemetry Ground References:</span>
                    <div className="flex flex-wrap gap-1">
                      {m.sourceReferences.map((ref, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 px-1 font-mono">{m.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs italic">
              <Bot className="w-4 h-4 animate-bounce text-forest-700 dark:text-emerald-400" />
              <span>Synthesizing cadastral evidence & generating grounded decision briefing...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-[#0c1626] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
            Briefing Queries:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-forest-50 dark:hover:bg-slate-700 hover:text-forest-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-forest-400 rounded-full px-3 py-1 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask questions regarding district risk, claim backlogs, or spatial discrepancies..."
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-forest-700 dark:focus:border-emerald-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputPrompt.trim() || isTyping}
            className="px-4 py-2 bg-forest-850 hover:bg-forest-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
