'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Component {
  name: string;
  position: { x: number; y: number };
  description: string;
}

interface Process {
  name: string;
  type: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  label: string;
  color: string;
}

interface AnalysisResult {
  object_detected: string;
  confidence: number;
  components: Component[];
  concepts: Array<{
    name: string;
    category: string;
    formulas: string[];
  }>;
  educational_info: {
    description: string;
    key_facts: string[];
    scientific_principles: string[];
    fun_fact: string;
  };
  processes?: Process[];
  image_width: number;
  image_height: number;
}

interface Props {
  imageUrl: string;
  analysisResult: AnalysisResult;
  onClose: () => void;
  onLearnMore: (conceptName: string) => void;
}

export default function AnnotatedResultViewer({ 
  imageUrl, 
  analysisResult, 
  onClose,
  onLearnMore 
}: Props) {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleShare = async () => {
    try {
      // Create a canvas to combine image and annotations
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Draw annotations
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      analysisResult.components.forEach((component) => {
        const x = component.position.x * canvas.width;
        const y = component.position.y * canvas.height;

        // Draw label background
        const textWidth = ctx.measureText(component.name).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x - textWidth / 2 - 10, y - 20, textWidth + 20, 40);

        // Draw label text
        ctx.fillStyle = '#00ff00';
        ctx.fillText(component.name, x, y);

        // Draw dot at component location
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0080';
        ctx.fill();
      });

      // Convert to blob and share
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], 'kairos-ar-analysis.jpg', { type: 'image/jpeg' });
        
        if (navigator.share) {
          await navigator.share({
            title: `${analysisResult.object_detected} - KAIROS AR Analysis`,
            text: analysisResult.educational_info.description,
            files: [file],
          });
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'kairos-ar-analysis.jpg';
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black"
    >
      {/* Main Image Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Analyzed Object"
          className="max-w-full max-h-full object-contain"
        />

        {/* Component Labels */}
        <AnimatePresence>
          {analysisResult.components.map((component, index) => {
            const xPercent = component.position.x * 100;
            const yPercent = component.position.y * 100;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                style={{
                  position: 'absolute',
                  left: `${xPercent}%`,
                  top: `${yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="cursor-pointer"
                onClick={() => setSelectedComponent(component)}
              >
                {/* Pulsing Dot */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 w-4 h-4 bg-kairos-accent rounded-full"
                />
                
                {/* Center Dot */}
                <div className="absolute inset-0 w-4 h-4 bg-white rounded-full border-2 border-kairos-accent shadow-lg" />

                {/* Label */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: -40, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                >
                  <div className="bg-gradient-to-r from-kairos-primary to-kairos-secondary text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-xl">
                    {component.name}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Process Arrows */}
        {analysisResult.processes?.map((process, index) => {
          const fromX = process.from.x * 100;
          const fromY = process.from.y * 100;
          const toX = process.to.x * 100;
          const toY = process.to.y * 100;

          const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
          const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));

          return (
            <motion.div
              key={`process-${index}`}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
              style={{
                position: 'absolute',
                left: `${fromX}%`,
                top: `${fromY}%`,
                width: `${length}%`,
                height: '3px',
                backgroundColor: process.color,
                transformOrigin: 'left center',
                transform: `rotate(${angle}deg)`,
              }}
            >
              {/* Arrow Label */}
              <div
                style={{
                  position: 'absolute',
                  top: '-30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: process.color,
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                {process.label}
              </div>
            </motion.div>
          );
        })}

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-4 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {analysisResult.object_detected}
              </h2>
              <p className="text-sm text-gray-300">
                Confidence: {Math.round(analysisResult.confidence * 100)}%
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <span className="text-white text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 z-10">
          <div className="flex items-center justify-center gap-4 max-w-7xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInfo(!showInfo)}
              className="px-6 py-3 bg-gradient-to-r from-kairos-primary to-kairos-secondary text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              📚 Educational Info
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (analysisResult.concepts[0]) {
                  onLearnMore(analysisResult.concepts[0].name);
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              🎓 Learn More
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              📤 Share
            </motion.button>
          </div>
        </div>
      </div>

      {/* Component Details Modal */}
      <AnimatePresence>
        {selectedComponent && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-lg rounded-2xl p-6 max-w-md z-20 border border-kairos-accent shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedComponent.name}
            </h3>
            <p className="text-gray-300 mb-4">
              {selectedComponent.description}
            </p>
            <button
              onClick={() => setSelectedComponent(null)}
              className="px-4 py-2 bg-kairos-accent text-white rounded-lg font-bold hover:bg-kairos-secondary transition-colors"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-black/95 backdrop-blur-xl border-l border-kairos-accent p-6 overflow-y-auto z-20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Educational Info</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-white text-2xl hover:text-kairos-accent transition-colors"
              >
                ×
              </button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-kairos-accent mb-2">DESCRIPTION</h4>
              <p className="text-gray-300 leading-relaxed">
                {analysisResult.educational_info.description}
              </p>
            </div>

            {/* Key Facts */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-kairos-accent mb-2">KEY FACTS</h4>
              <ul className="space-y-2">
                {analysisResult.educational_info.key_facts.map((fact, index) => (
                  <li key={index} className="text-gray-300 flex items-start gap-2">
                    <span className="text-kairos-accent">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scientific Principles */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-kairos-accent mb-2">SCIENTIFIC PRINCIPLES</h4>
              <ul className="space-y-2">
                {analysisResult.educational_info.scientific_principles.map((principle, index) => (
                  <li key={index} className="text-gray-300 flex items-start gap-2">
                    <span className="text-kairos-accent">•</span>
                    <span>{principle}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fun Fact */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
              <h4 className="text-sm font-bold text-yellow-400 mb-2">💡 FUN FACT</h4>
              <p className="text-gray-300 italic">
                {analysisResult.educational_info.fun_fact}
              </p>
            </div>

            {/* Concepts */}
            <div className="mt-6">
              <h4 className="text-sm font-bold text-kairos-accent mb-3">RELATED CONCEPTS</h4>
              <div className="space-y-2">
                {analysisResult.concepts.map((concept, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-kairos-primary/20 to-kairos-secondary/20 rounded-lg p-3 border border-kairos-accent/30"
                  >
                    <div className="font-bold text-white mb-1">{concept.name}</div>
                    <div className="text-xs text-gray-400 uppercase mb-2">{concept.category}</div>
                    {concept.formulas.length > 0 && (
                      <div className="text-sm text-gray-300 font-mono">
                        {concept.formulas[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
