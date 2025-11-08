'use client';

import { useState } from 'react';
import type { ScientificConcept, StudyModule } from '@/types';
import Link from 'next/link';

interface ConceptPanelProps {
  concepts: ScientificConcept[];
  modules: StudyModule[];
  isLoading: boolean;
  webInfo?: {
    description?: string;
    key_facts?: string[];
    scientific_principles?: string[];
    fun_fact?: string;
  };
}

export default function ConceptPanel({ concepts, modules, isLoading, webInfo }: ConceptPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="absolute top-20 left-4 bg-black/80 text-white px-4 py-3 rounded-lg backdrop-blur-sm z-40 max-w-sm">
        <div className="flex items-center gap-2">
          <div className="loading-spinner w-4 h-4" />
          <span>Analyzing concepts...</span>
        </div>
      </div>
    );
  }

  if (concepts.length === 0) return null;

  return (
    <div className="absolute top-4 left-4 w-96 bg-black/90 backdrop-blur-md rounded-lg p-6 text-white shadow-2xl z-40 border border-kairos-primary/30 max-h-[90vh] overflow-y-auto">
      <div className="concept-card bg-black/90 backdrop-blur-md border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔬</span> Detected Concepts
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:text-kairos-accent transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>

        {/* Web Search Info */}
        {webInfo && webInfo.description && (
          <div className="mb-4 bg-gradient-to-r from-kairos-primary/20 to-kairos-secondary/20 rounded-lg p-4 border border-kairos-primary/30">
            <h4 className="text-sm font-bold text-kairos-accent mb-2 flex items-center gap-2">
              <span>🌐</span> Web Search Info
            </h4>
            <p className="text-sm text-gray-200 leading-relaxed mb-3">
              {webInfo.description}
            </p>
            
            {webInfo.key_facts && webInfo.key_facts.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-300 mb-1">Key Facts:</p>
                <ul className="text-xs text-gray-200 space-y-1">
                  {webInfo.key_facts.slice(0, 3).map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-kairos-accent">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {webInfo.fun_fact && (
              <div className="bg-black/30 rounded p-2 text-xs text-yellow-300 italic">
                💡 {webInfo.fun_fact}
              </div>
            )}
          </div>
        )}

        {/* Concepts List */}
        {isExpanded && (
          <div className="space-y-3">
            {concepts.map((concept, index) => (
              <div
                key={concept.id}
                className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">{concept.name}</h4>
                    <span className="text-xs text-gray-300 bg-kairos-accent/30 px-2 py-1 rounded-full">
                      {concept.category}
                    </span>
                  </div>
                  <div className="text-2xl">
                    {getCategoryIcon(concept.category)}
                  </div>
                </div>

                {/* Formulas */}
                {concept.formulas && concept.formulas.length > 0 && (
                  <div className="mt-2 text-sm text-gray-200 font-mono bg-black/30 px-2 py-1 rounded">
                    {concept.formulas[0]}
                  </div>
                )}
              </div>
            ))}

            {/* Module Recommendations */}
            {modules && modules.length > 0 && (
              <div className="mt-4 border-t border-white/20 pt-4">
                <h4 className="text-sm font-bold text-white mb-2">📚 Recommended Modules:</h4>
                <div className="space-y-2">
                  {modules.slice(0, 3).map((module) => (
                    <Link
                      key={module.id}
                      href={`/modules?topic=${encodeURIComponent(module.title)}`}
                      className="block"
                    >
                      <div className="bg-kairos-primary/20 hover:bg-kairos-primary/40 rounded-lg p-3 transition-all border border-kairos-primary/30">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white text-sm">{module.title}</span>
                          <span className="text-xs text-kairos-accent">→</span>
                        </div>
                        {module.difficulty && (
                          <span className="text-xs text-gray-300 capitalize">
                            {module.difficulty}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Learn More Button */}
            <Link href="/modules">
              <button className="w-full bg-kairos-primary hover:bg-kairos-secondary text-white font-bold py-3 px-4 rounded-lg transition-all mt-4">
                📚 View All Study Modules
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    physics: '⚛️',
    chemistry: '🧪',
    biology: '🧬',
    geometry: '📐',
    engineering: '⚙️',
    general: '📋',
  };
  return icons[category] || '📋';
}
