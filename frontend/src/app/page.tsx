'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentFeature, setCurrentFeature] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 5);
    }, 3000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const features = [
    {
      icon: '📷',
      title: 'Real-Time Scanning',
      description: 'Point your camera at any object and watch KAIROS identify it instantly using browser-based ML models',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    },
    {
      icon: '🔬',
      title: 'Scientific Concepts',
      description: 'Discover hidden principles: torque, diffusion, geometry, friction, and more in everyday objects',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
    },
    {
      icon: '✨',
      title: 'AR Overlays',
      description: 'See vector arrows, flows, diagrams, and animations overlaid directly on real objects',
      gradient: 'from-amber-500 via-orange-500 to-red-500',
    },
    {
      icon: '📚',
      title: 'Study Modules',
      description: 'Get detailed explanations, formulas, examples, and practice questions for each concept',
      gradient: 'from-emerald-500 via-green-500 to-lime-500',
    },
    {
      icon: '🤖',
      title: 'AI RAG Assistant',
      description: 'Chat with an intelligent AI assistant powered by RAG technology for personalized learning support',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    },
  ];

  const examples = [
    {
      object: '🌱 Plant',
      concepts: ['Photosynthesis', 'Diffusion', 'Transpiration', 'Osmosis'],
      color: 'from-green-500 to-emerald-600',
      shadow: 'shadow-green-500/50',
    },
    {
      object: '🚲 Bicycle',
      concepts: ['Torque', 'Angular Momentum', 'Mechanical Advantage', 'Friction'],
      color: 'from-blue-500 to-cyan-600',
      shadow: 'shadow-blue-500/50',
    },
    {
      object: '🍶 Bottle',
      concepts: ['Volume & Surface Area', 'Pressure', 'Material Properties', 'Geometry'],
      color: 'from-purple-500 to-pink-600',
      shadow: 'shadow-purple-500/50',
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated cursor follower */}
      <motion.div
        className="fixed w-6 h-6 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      >
        <div className="w-full h-full bg-white rounded-full blur-sm"></div>
      </motion.div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-blue-950"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: Math.random() * 0.5,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                opacity: [null, Math.random() * 0.5, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>

        {/* Glowing orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600 rounded-full blur-[150px]"
        />
        
        <motion.div
          style={{ opacity, scale, y }}
          className="container mx-auto px-4 py-20 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center"
          >
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8"
            >
              <span className="text-2xl">✨</span>
              <span className="text-white/90 font-medium">Next-Generation AI Learning Platform</span>
            </motion.div>

            {/* Main title with stagger animation */}
            <div className="mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-7xl md:text-9xl font-black text-white mb-4 tracking-tight"
              >
                KAIROS
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="inline-block"
              >
                <span className="text-6xl md:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  2.0
                </span>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-2xl md:text-3xl text-gray-300 mb-6 max-w-4xl mx-auto font-light"
            >
              Transform your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">camera</span> into an{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-semibold">AI-powered science teacher</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Scan any real-world object and unlock the hidden scientific principles with stunning AR overlays, 
              instant study modules, and intelligent AI assistance
            </motion.p>

            {/* CTA Buttons with premium design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/scan">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(168, 85, 247, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white text-lg font-bold rounded-2xl overflow-hidden shadow-2xl"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="text-2xl">🚀</span>
                    <span>Start Scanning</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </motion.button>
              </Link>

              <Link href="/modules">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white text-lg font-bold rounded-2xl border-2 border-white/30 hover:border-white/50 transition-all shadow-xl"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    <span>Browse Modules</span>
                  </span>
                </motion.button>
              </Link>

              <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(236, 72, 153, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-lg font-bold rounded-2xl shadow-2xl"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">🤖</span>
                    <span>AI Assistant</span>
                  </span>
                </motion.button>
              </a>
            </motion.div>

            {/* Stats showcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              {[
                { value: 'Top-Tier', label: 'RAG Engine' },
                { value: 'Real-Time', label: 'AI Detection' },
                { value: 'Free', label: 'Forever' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-white/50"
            >
              <span className="text-sm">Scroll to explore</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-gradient-to-b from-black via-slate-950 to-black">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="inline-block text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              style={{ backgroundSize: '200% 200%' }}
            >
              Powerful Features
            </motion.div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to explore science in an immersive, interactive way
            </p>
          </motion.div>

          {/* Feature cards carousel */}
          <div className="relative max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Animated gradient overlay */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  
                  {/* Glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="text-6xl mb-6"
                      animate={currentFeature === index ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="relative py-32 bg-black">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-950/30 via-transparent to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6">
              See It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">In Action</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-world examples of scientific concepts detected and explained by KAIROS 2.0
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
                style={{ perspective: "1000px" }}
              >
                {/* Card with 3D effect */}
                <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${example.color} overflow-hidden shadow-2xl ${example.shadow}`}>
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8 }}
                  />

                  {/* Glass morphism overlay */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

                  <div className="relative z-10">
                    <motion.div 
                      className="text-7xl mb-6"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {example.object.split(' ')[0]}
                    </motion.div>
                    
                    <h3 className="text-3xl font-black text-white mb-2">
                      {example.object.split(' ')[1]}
                    </h3>
                    
                    <div className="h-0.5 w-20 bg-white/50 mb-6"></div>
                    
                    <h4 className="text-lg font-bold text-white/90 mb-4">
                      Detected Concepts:
                    </h4>
                    
                    <div className="space-y-2">
                      {example.concepts.map((concept, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ x: 10, scale: 1.05 }}
                          className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 cursor-pointer"
                        >
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                          <span className="text-white font-medium">{concept}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Floating particles inside card */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white/50 rounded-full"
                      animate={{
                        y: [0, -100],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                      style={{
                        left: `${20 + i * 15}%`,
                        bottom: 0,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900"></div>
        
        {/* Animated mesh gradient */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-20 left-20 w-40 h-40 border-4 border-white/20 rounded-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.3, 1],
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-20 right-20 w-60 h-60 border-4 border-white/20 rounded-full"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Premium badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 mb-8"
            >
              <span className="text-3xl">🎓</span>
              <span className="text-white font-semibold text-lg">Join Thousands of Learners</span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Ready to Transform
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400">
                Your Learning?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Start exploring the science behind everyday objects.{' '}
              <span className="font-bold text-yellow-300">No installation</span>,{' '}
              <span className="font-bold text-pink-300">no database</span>,{' '}
              <span className="font-bold text-cyan-300">completely free</span>.
            </p>

            <Link href="/scan">
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 30px 80px rgba(255, 255, 255, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-6 bg-white text-purple-900 text-xl font-black rounded-2xl shadow-2xl overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="relative z-10 flex items-center gap-4">
                  <span>Launch KAIROS 2.0</span>
                  <motion.span
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-2xl"
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </Link>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-16 flex flex-wrap justify-center gap-8 text-white/70"
            >
              {[
                { icon: '⚡', text: 'Instant Results' },
                { icon: '🔒', text: 'Privacy First' },
     
                { icon: '💎', text: 'Premium Quality' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, color: '#ffffff' }}
                  className="flex items-center gap-2"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black border-t border-white/10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <motion.h3
                whileHover={{ scale: 1.05 }}
                className="text-4xl font-black text-white mb-4"
              >
                KAIROS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">2.0</span>
              </motion.h3>
              <p className="text-gray-400 leading-relaxed">
                Next-generation AI learning platform that transforms your camera into an interactive science teacher.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold text-white mb-4">Quick Links</h4>
              <div className="space-y-3">
                {[
                  { label: 'Start Scanning', href: '/scan' },
                  { label: 'Browse Modules', href: '/modules' },
                  { label: 'AI Assistant', href: 'http://localhost:3000' },
                ].map((link, i) => (
                  <motion.div key={i} whileHover={{ x: 5 }}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      <span className="text-purple-400">→</span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-xl font-bold text-white mb-4">Built With</h4>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'WebXR', 'TensorFlow.js', 'WebLLM', 'Framer Motion'].map((tech, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm hover:bg-white/10 hover:text-white transition-all"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-gray-500">
              © 2025 KAIROS 2.0. Open-source AI learning platform.
            </p>
            <motion.p
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="mt-2 text-sm bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold"
              style={{ backgroundSize: '200% 200%' }}
            >
              Empowering learners worldwide with AI-powered education ✨
            </motion.p>
          </div>
        </div>
      </footer>
    </div>
  );
}
