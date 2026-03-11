/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  console.log("Arcade: App Component Rendering", { gamesData });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Robust games data handling
  const games = useMemo(() => {
    if (Array.isArray(gamesData) && gamesData.length > 0) {
      return gamesData;
    }
    console.warn("Arcade: No games found in games.json, using fallback debug game.");
    return [{
      id: 'debug-1',
      title: 'System Check',
      description: 'If you see this, the app is working but games.json is empty or failing to load.',
      thumbnail: 'https://picsum.photos/seed/arcade/800/450',
      url: '#'
    }];
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter(game =>
      (game.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (game.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, games]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Debug Indicator */}
      <div className="bg-emerald-500/20 text-emerald-500 text-[8px] py-0.5 text-center font-mono uppercase tracking-[0.5em] border-b border-emerald-500/10">
        App Component Mounted & Active
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setSelectedGame(null)}
        >
          <div className="bg-emerald-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Gamepad2 className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tighter uppercase italic">
            Unblocked<span className="text-emerald-500">Arcade</span>
          </h1>
        </div>

        {!selectedGame && (
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search games..."
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-widest hidden lg:block">
            System Online
          </span>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest hidden sm:block">
            {filteredGames.length} Games Available
          </span>
        </div>
      </header>

      <main className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto"
            >
              {/* Mobile Search */}
              <div className="relative w-full mb-8 md:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      layoutId={`game-${game.id}`}
                      className="group relative bg-zinc-900 rounded-2xl overflow-hidden brutal-border cursor-pointer flex flex-col"
                      onClick={() => setSelectedGame(game)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-3 left-3">
                           <span className="bg-emerald-500 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                             Play Now
                           </span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold mb-1 group-hover:text-emerald-400 transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-sm text-zinc-400 line-clamp-2">
                          {game.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-zinc-900 p-6 rounded-full mb-4">
                    <Search className="w-12 h-12 text-zinc-700" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">No games found</h2>
                  <p className="text-zinc-500">Try searching for something else or browse our collection.</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-6 text-emerald-500 font-bold hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-6xl mx-auto h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-medium"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Arcade
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a
                    href={selectedGame.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative flex-1 bg-black rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl min-h-[60vh]">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="mt-6 p-6 bg-zinc-900 rounded-2xl border border-white/5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">
                      {selectedGame.title}
                    </h2>
                    <p className="text-zinc-400 max-w-2xl">
                      {selectedGame.description}
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20 font-mono text-xs font-bold uppercase tracking-widest">
                      Verified Safe
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-8 border-t border-white/5 text-center">
        <p className="text-zinc-600 text-xs font-mono uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Unblocked Arcade &bull; Play Responsibly
        </p>
      </footer>
    </div>
  );
}
