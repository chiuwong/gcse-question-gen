"use client";
import { useState } from "react";
import { SUBJECTS, MARK_OPTIONS } from "@/lib/subjects";

interface GeneratedQ {
  question: string;
  markScheme: string;
}

interface MarkResult {
  score: number;
  feedback: string;
  awarded: string[];
  missed: string[];
  improvements: string;
}

export default function Home() {
  const [subject, setSubject] = useState(SUBJECTS[0].name);
  const [topic, setTopic] = useState(SUBJECTS[0].topics[0]);
  const [marks, setMarks] = useState(6);

  const [generated, setGenerated] = useState<GeneratedQ | null>(null);
  const [generating, setGenerating] = useState(false);

  const [showMarkScheme, setShowMarkScheme] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [marking, setMarking] = useState(false);
  const [result, setResult] = useState<MarkResult | null>(null);

  const currentSubject = SUBJECTS.find((s) => s.name === subject)!;

  function handleSubjectChange(s: string) {
    setSubject(s);
    const found = SUBJECTS.find((x) => x.name === s)!;
    setTopic(found.topics[0]);
    setGenerated(null);
    setResult(null);
    setShowMarkScheme(false);
    setStudentAnswer("");
  }

  async function generate() {
    setGenerating(true);
    setGenerated(null);
    setResult(null);
    setShowMarkScheme(false);
    setStudentAnswer("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, marks }),
      });
      const data = await res.json();
      setGenerated(data);
    } finally {
      setGenerating(false);
    }
  }

  async function markAnswer() {
    if (!generated || !studentAnswer.trim()) return;
    setMarking(true);
    setResult(null);
    try {
      const res = await fetch("/api/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          question: generated.question,
          markScheme: generated.markScheme,
          studentAnswer,
          marks,
        }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setMarking(false);
    }
  }

  const scoreColor = result
    ? result.score >= marks * 0.75
      ? "text-green-600"
      : result.score >= marks * 0.5
      ? "text-amber-600"
      : "text-red-600"
    : "";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">GCSE Question Generator</h1>
          <p className="text-slate-400 text-sm mt-1">
            AI-generated exam-style questions with mark schemes &amp; instant marking
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700">Choose your question</h2>

          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              {SUBJECTS.map((s) => (
                <option key={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              {currentSubject.topics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">Marks</label>
            <div className="flex gap-2 flex-wrap">
              {MARK_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMarks(m)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    marks === m
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"
                  }`}
                >
                  {m} marks
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={generating}
            className="w-full bg-slate-900 hover:bg-slate-700 disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {generating ? "Generating question…" : "Generate Question"}
          </button>
        </div>

        {/* Generated Question */}
        {generated && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Question — {marks} marks
              </span>
              <p className="mt-2 text-slate-800 leading-relaxed text-[15px]">
                {generated.question}
              </p>
            </div>

            {/* Mark scheme toggle */}
            <button
              onClick={() => setShowMarkScheme((v) => !v)}
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              {showMarkScheme ? "Hide mark scheme" : "Show mark scheme"}
            </button>

            {showMarkScheme && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wide">
                  Mark Scheme
                </p>
                <p className="text-sm text-amber-900 whitespace-pre-line">
                  {generated.markScheme}
                </p>
              </div>
            )}

            {/* Answer box */}
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">
                Your Answer
              </label>
              <textarea
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                rows={6}
                placeholder="Write your answer here…"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
              />
            </div>

            <button
              onClick={markAnswer}
              disabled={marking || !studentAnswer.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              {marking ? "Marking your answer…" : "Submit for Marking"}
            </button>
          </div>
        )}

        {/* Marking Result */}
        {result && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className={`text-4xl font-bold tabular-nums ${scoreColor}`}>
                {result.score}/{marks}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {result.score >= marks * 0.75
                    ? "Excellent work!"
                    : result.score >= marks * 0.5
                    ? "Good effort"
                    : "Keep practising"}
                </p>
                <p className="text-xs text-slate-400">
                  {Math.round((result.score / marks) * 100)}% of available marks
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600">{result.feedback}</p>

            {result.awarded.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-700 mb-1.5">Points Awarded</p>
                <ul className="space-y-1">
                  {result.awarded.map((p, i) => (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.missed.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-red-600 mb-1.5">Points Missed</p>
                <ul className="space-y-1">
                  {result.missed.map((p, i) => (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-red-400 flex-shrink-0">✗</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-700 mb-1">How to improve</p>
              <p className="text-sm text-blue-900">{result.improvements}</p>
            </div>

            <button
              onClick={generate}
              className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              Generate Another Question
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
