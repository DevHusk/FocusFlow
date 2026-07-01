import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2, VolumeX, Play, Pause, Repeat, CloudRain,
  Trees, Coffee, Radio, Leaf, Waves,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { cn } from '@/utils';
import type { AmbientSound } from '@/types';

interface SoundOption {
  id: AmbientSound;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const sounds: SoundOption[] = [
  { id: 'rain', label: 'Rain', icon: CloudRain, color: '#4F8CFF', description: 'Gentle rainfall for deep focus' },
  { id: 'forest', label: 'Forest', icon: Trees, color: '#22C55E', description: 'Birds and rustling leaves' },
  { id: 'cafe', label: 'Café', icon: Coffee, color: '#F59E0B', description: 'Ambient café chatter' },
  { id: 'brown-noise', label: 'Brown Noise', icon: Waves, color: '#7C5CFF', description: 'Deep, low-frequency hum' },
  { id: 'white-noise', label: 'White Noise', icon: Radio, color: '#EC4899', description: 'Consistent static noise' },
  { id: 'nature', label: 'Nature', icon: Leaf, color: '#14B8A6', description: 'Streams and wind' },
];

export default function MusicPage() {
  const [activeSound, setActiveSound] = useState<AmbientSound | null>(null);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Simulate audio controls (no actual audio files)
  const toggleSound = (soundId: AmbientSound) => {
    if (activeSound === soundId) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSound(soundId);
      setIsPlaying(true);
    }
  };

  const stop = () => {
    setIsPlaying(false);
    setActiveSound(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Focus Music</h1>
        <p className="text-sm text-text-secondary mt-1">Ambient sounds to help you concentrate</p>
      </div>

      {/* Now Playing */}
      {activeSound && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {(() => {
                const s = sounds.find(s => s.id === activeSound)!;
                const Icon = s.icon;
                return (
                  <>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${s.color}20` }}>
                      <Icon size={24} style={{ color: s.color }} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-text">{s.label}</p>
                      <p className="text-sm text-text-secondary">{s.description}</p>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setLoop(!loop)}
                className={cn('h-10 w-10', loop && 'text-primary')}>
                <Repeat size={18} />
              </Button>
              <Button variant="primary" size="icon" onClick={stop} className="h-10 w-10">
                <Pause size={18} />
              </Button>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
            {volume === 0 ? <VolumeX size={16} className="text-text-tertiary" /> : <Volume2 size={16} className="text-text-tertiary" />}
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="flex-1 h-1.5 bg-bg-elevated rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-glow"
            />
            <span className="text-xs text-text-tertiary w-8 text-right">{volume}%</span>
          </div>
        </Card>
      )}

      {/* Sound options */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sounds.map((sound, i) => {
          const Icon = sound.icon;
          const isActive = activeSound === sound.id;
          return (
            <motion.div
              key={sound.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                hover
                className={cn(
                  'cursor-pointer transition-all',
                  isActive && 'border-primary shadow-glow'
                )}
                onClick={() => toggleSound(sound.id)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center transition-all',
                      isActive && 'animate-pulse-slow'
                    )}
                    style={{ backgroundColor: `${sound.color}${isActive ? '30' : '10'}` }}
                  >
                    <Icon size={24} style={{ color: sound.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-text">{sound.label}</p>
                    <p className="text-sm text-text-secondary">{sound.description}</p>
                  </div>
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                    isActive ? 'bg-primary text-white' : 'bg-bg-elevated text-text-secondary hover:bg-bg-hover'
                  )}>
                    {isActive && isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tips */}
      <Card className="bg-bg-elevated">
        <h3 className="text-sm font-semibold text-text mb-2">Study Tips</h3>
        <div className="grid sm:grid-cols-3 gap-3 text-xs text-text-secondary">
          <p>Rain and brown noise are great for deep focus work.</p>
          <p>Café sounds can help with creative tasks and writing.</p>
          <p>Nature sounds are ideal for relaxed reading sessions.</p>
        </div>
      </Card>
    </div>
  );
}
