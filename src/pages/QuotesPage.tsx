import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, RefreshCw, Quote, Share2, Copy, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MOTIVATIONAL_QUOTES } from '@/constants';
import { cn } from '@/utils';

export default function QuotesPage() {
  const { state, dispatch } = useApp();
  const [dailyQuoteIndex, setDailyQuoteIndex] = useState(new Date().getDate() % MOTIVATIONAL_QUOTES.length);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [copied, setCopied] = useState(false);

  const quotes = useMemo(() => {
    return MOTIVATIONAL_QUOTES.map((q, i) => ({
      ...q,
      id: `quote-${i}`,
      favorite: state.favoriteQuotes.includes(`quote-${i}`),
    }));
  }, [state.favoriteQuotes]);

  const displayQuotes = filter === 'favorites' ? quotes.filter(q => q.favorite) : quotes;

  const refreshDaily = () => {
    setDailyQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const toggleFavorite = (id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE_QUOTE', payload: id });
  };

  const copyQuote = (text: string) => {
    navigator.clipboard.writeText(`"${text}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dailyQuote = MOTIVATIONAL_QUOTES[dailyQuoteIndex];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-text">Quotes</h1>
        <p className="text-sm text-text-secondary mt-1">Daily inspiration to keep you motivated</p>
      </div>

      {/* Daily Quote Hero */}
      <Card className="bg-gradient-to-br from-primary/10 via-bg-card to-accent/10 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Star size={16} className="text-warning" />
          <span className="text-sm font-medium text-text-secondary">Today's Quote</span>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" onClick={refreshDaily} className="h-8 w-8">
            <RefreshCw size={14} />
          </Button>
        </div>
        <motion.div key={dailyQuoteIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start gap-4">
            <Quote size={32} className="text-primary shrink-0 mt-1" />
            <div>
              <p className="text-xl sm:text-2xl font-medium text-text leading-relaxed italic">
                "{dailyQuote.text}"
              </p>
              <p className="text-sm text-text-secondary mt-3">— {dailyQuote.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Button variant="secondary" size="sm" onClick={() => copyQuote(dailyQuote.text)}>
              <Copy size={14} /> Copy
            </Button>
            <Button variant="secondary" size="sm" onClick={() => toggleFavorite(`quote-${dailyQuoteIndex}`)}>
              <Heart size={14} className={cn(state.favoriteQuotes.includes(`quote-${dailyQuoteIndex}`) && 'fill-danger text-danger')} />
              {state.favoriteQuotes.includes(`quote-${dailyQuoteIndex}`) ? 'Favorited' : 'Favorite'}
            </Button>
          </div>
        </motion.div>
      </Card>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <button onClick={() => setFilter('all')}
          className={cn('px-3 py-1.5 rounded-xl text-sm font-medium transition-all',
            filter === 'all' ? 'bg-primary text-white' : 'bg-card text-text-secondary border border-white/[0.06] hover:text-text')}>
          All Quotes
        </button>
        <button onClick={() => setFilter('favorites')}
          className={cn('px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1',
            filter === 'favorites' ? 'bg-danger text-white' : 'bg-card text-text-secondary border border-white/[0.06] hover:text-text')}>
          <Heart size={12} /> Favorites
        </button>
      </div>

      {/* Quotes grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayQuotes.map((quote, i) => (
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card hover className="h-full flex flex-col">
              <div className="flex-1">
                <Quote size={20} className="text-primary/30 mb-2" />
                <p className="text-sm text-text-secondary italic leading-relaxed">"{quote.text}"</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
                <span className="text-xs text-text-tertiary">— {quote.author}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => copyQuote(quote.text)}
                    className="p-1.5 rounded-lg hover:bg-card text-text-muted hover:text-text-secondary transition-colors">
                    <Copy size={12} />
                  </button>
                  <button onClick={() => toggleFavorite(quote.id)}
                    className="p-1.5 rounded-lg hover:bg-card text-text-muted hover:text-danger transition-colors">
                    <Heart size={12} className={cn(quote.favorite && 'fill-danger text-danger')} />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {displayQuotes.length === 0 && (
        <div className="text-center py-12">
          <Quote size={32} className="mx-auto text-text-muted mb-3" />
          <p className="text-sm text-text-tertiary">No favorite quotes yet</p>
          <p className="text-xs text-text-muted mt-1">Click the heart icon to save quotes you love</p>
        </div>
      )}
    </div>
  );
}
