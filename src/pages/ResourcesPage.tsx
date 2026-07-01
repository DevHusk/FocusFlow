import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Heart, ExternalLink, Trash2, Edit3,
  FileText, Video, Globe, BookOpen, StickyNote, Star, Library,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { generateId, cn } from '@/utils';
import type { Resource, ResourceType } from '@/types';

const resourceTypeIcons: Record<ResourceType, React.ElementType> = {
  pdf: FileText,
  youtube: Video,
  website: Globe,
  book: BookOpen,
  note: StickyNote,
};

const resourceTypeColors: Record<ResourceType, string> = {
  pdf: '#FB7185',
  youtube: '#FF0000',
  website: '#00E5C7',
  book: '#34D399',
  note: '#D946EF',
};

const resourceCategories = ['General', 'Mathematics', 'Science', 'Programming', 'Languages', 'History', 'Literature', 'Other'];

export default function ResourcesPage() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('website');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');

  const filteredResources = useMemo(() => {
    let resources = [...state.resources];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      resources = resources.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.url?.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filterType !== 'all') resources = resources.filter(r => r.type === filterType);
    if (filterCategory !== 'all') resources = resources.filter(r => r.category === filterCategory);
    if (showFavoritesOnly) resources = resources.filter(r => r.favorite);

    return resources.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [state.resources, searchQuery, filterType, filterCategory, showFavoritesOnly]);

  const handleSave = () => {
    if (!title.trim()) return;
    dispatch({
      type: 'ADD_RESOURCE',
      payload: {
        id: generateId(), title, type: resourceType,
        url: url || undefined, content: content || undefined,
        category, subjectId: undefined, favorite: false, tags: [],
        createdAt: new Date().toISOString(),
      },
    });
    setShowModal(false);
    setTitle(''); setUrl(''); setContent('');
  };

  const toggleFavorite = (resource: Resource) => {
    dispatch({ type: 'UPDATE_RESOURCE', payload: { ...resource, favorite: !resource.favorite } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Resources</h1>
          <p className="text-sm text-text-secondary mt-1">Store PDFs, links, books, and reference materials</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={16} /> Add Resource</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input placeholder="Search resources..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} icon={<Search size={16} />} />
        </div>
        <Select value={filterType} onChange={e => setFilterType(e.target.value)}
          options={[{ value: 'all', label: 'All Types' }, { value: 'pdf', label: 'PDF' }, { value: 'youtube', label: 'YouTube' }, { value: 'website', label: 'Website' }, { value: 'book', label: 'Book' }, { value: 'note', label: 'Note' }]} />
        <Select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          options={[{ value: 'all', label: 'All Categories' }, ...resourceCategories.map(c => ({ value: c, label: c }))]} />
        <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={cn('flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all',
            showFavoritesOnly ? 'border-warning bg-warning/10 text-warning' : 'border-white/[0.06] bg-card text-text-secondary hover:text-text')}>
          <Heart size={14} className={showFavoritesOnly ? 'fill-warning' : ''} /> Favorites
        </button>
      </div>

      {/* Resources grid */}
      {filteredResources.length === 0 ? (
        <EmptyState
          icon={<Library size={28} />}
          title="No resources yet"
          description="Save PDFs, YouTube videos, websites, and books for quick access"
          action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Add Resource</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredResources.map(resource => {
              const Icon = resourceTypeIcons[resource.type];
              return (
                <motion.div key={resource.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} layout>
                  <Card hover className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${resourceTypeColors[resource.type]}15` }}>
                          <Icon size={16} style={{ color: resourceTypeColors[resource.type] }} />
                        </div>
                        <Badge variant="default" size="sm">{resource.type}</Badge>
                      </div>
                      <button onClick={() => toggleFavorite(resource)} className="text-text-muted hover:text-warning transition-colors">
                        <Heart size={14} className={cn(resource.favorite && 'fill-warning text-warning')} />
                      </button>
                    </div>
                    <h3 className="text-sm font-semibold text-text mb-1 line-clamp-2">{resource.title}</h3>
                    {resource.url && (
                      <a href={resource.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-primary-hover flex items-center gap-1 mb-2 truncate">
                        {new URL(resource.url).hostname} <ExternalLink size={10} />
                      </a>
                    )}
                    {resource.content && <p className="text-xs text-text-tertiary line-clamp-2 flex-1">{resource.content}</p>}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                      <span className="text-xs text-text-muted">{resource.category}</span>
                      <button onClick={() => dispatch({ type: 'DELETE_RESOURCE', payload: resource.id })}
                        className="text-text-muted hover:text-danger transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Resource">
        <div className="space-y-4">
          <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Resource title" />
          <Select label="Type" value={resourceType} onChange={e => setResourceType(e.target.value as ResourceType)}
            options={[{ value: 'website', label: 'Website' }, { value: 'pdf', label: 'PDF' }, { value: 'youtube', label: 'YouTube' }, { value: 'book', label: 'Book' }, { value: 'note', label: 'Note' }]} />
          <Input label="URL" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
          <Select label="Category" value={category} onChange={e => setCategory(e.target.value)}
            options={resourceCategories.map(c => ({ value: c, label: c }))} />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Notes</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 bg-card border border-white/[0.06] rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/[0.3] resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} className="flex-1">Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
