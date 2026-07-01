import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Pin, Trash2, Edit3, Folder, Tag,
  StickyNote, X, Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { generateId, cn } from '@/utils';
import type { Note, NoteFolder } from '@/types';

export default function NotesPage() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState<string[]>([]);
  const [notePinned, setNotePinned] = useState(false);
  const [noteFolderId, setNoteFolderId] = useState<string | undefined>();
  const [newTag, setNewTag] = useState('');
  const [folderName, setFolderName] = useState('');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    state.notes.forEach(n => n.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [state.notes]);

  const filteredNotes = useMemo(() => {
    let notes = [...state.notes];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      notes = notes.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedFolder) {
      notes = notes.filter(n => n.folderId === selectedFolder);
    }

    if (selectedTag) {
      notes = notes.filter(n => n.tags.includes(selectedTag));
    }

    // Pinned first
    return [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [state.notes, searchQuery, selectedFolder, selectedTag]);

  const openCreate = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteTags([]);
    setNotePinned(false);
    setNoteFolderId(selectedFolder ?? undefined);
    setShowEditor(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTags([...note.tags]);
    setNotePinned(note.pinned);
    setNoteFolderId(note.folderId);
    setShowEditor(true);
  };

  const saveNote = () => {
    if (!noteTitle.trim()) return;
    if (editingNote) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: { ...editingNote, title: noteTitle, content: noteContent, tags: noteTags, pinned: notePinned, folderId: noteFolderId, updatedAt: new Date().toISOString() },
      });
    } else {
      dispatch({
        type: 'ADD_NOTE',
        payload: {
          id: generateId(), title: noteTitle, content: noteContent, tags: noteTags, pinned: notePinned, folderId: noteFolderId,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), order: state.notes.length,
        },
      });
    }
    setShowEditor(false);
  };

  const addTag = () => {
    if (newTag.trim() && !noteTags.includes(newTag.trim())) {
      setNoteTags([...noteTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setNoteTags(noteTags.filter(t => t !== tag));
  };

  const createFolder = () => {
    if (!folderName.trim()) return;
    dispatch({
      type: 'ADD_NOTE_FOLDER',
      payload: { id: generateId(), name: folderName, createdAt: new Date().toISOString() },
    });
    setFolderName('');
    setShowFolderModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Notes</h1>
          <p className="text-sm text-text-secondary mt-1">{state.notes.length} notes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowFolderModal(true)}>
            <Folder size={16} /> New Folder
          </Button>
          <Button onClick={openCreate}>
            <Plus size={16} /> New Note
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar: folders & tags */}
        <div className="w-48 shrink-0 hidden lg:block">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2 px-2">Folders</h3>
          <button
            onClick={() => setSelectedFolder(null)}
            className={cn('w-full text-left px-3 py-2 rounded-xl text-sm transition-colors', !selectedFolder ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-card')}
          >
            All Notes
          </button>
          {state.noteFolders.map(folder => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={cn('w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2',
                selectedFolder === folder.id ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-card'
              )}
            >
              <Folder size={14} />
              {folder.name}
            </button>
          ))}

          {allTags.length > 0 && (
            <>
              <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mt-4 mb-2 px-2">Tags</h3>
              <div className="flex flex-wrap gap-1 px-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={cn('px-2 py-0.5 rounded-lg text-xs transition-colors',
                      selectedTag === tag ? 'bg-primary text-white' : 'bg-card text-text-secondary hover:bg-card'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notes grid */}
        <div className="flex-1">
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={16} />}
            className="mb-4"
          />

          {filteredNotes.length === 0 ? (
            <EmptyState
              icon={<StickyNote size={28} />}
              title="No notes yet"
              description="Create your first note to capture ideas and study materials"
              action={<Button onClick={openCreate}><Plus size={16} /> Create Note</Button>}
            />
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredNotes.map(note => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <Card hover className="h-full flex flex-col" onClick={() => openEdit(note)}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-text truncate flex-1">{note.title}</h3>
                        {note.pinned && <Pin size={14} className="text-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-text-tertiary line-clamp-3 flex-1 mb-3">{note.content || 'Empty note'}</p>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {note.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded bg-card text-xs text-text-muted">{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                        <span className="text-xs text-text-muted">
                          {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_NOTE', payload: note.id }); }}
                          className="text-text-muted hover:text-danger transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Note Editor Modal */}
      <Modal isOpen={showEditor} onClose={() => setShowEditor(false)} title={editingNote ? 'Edit Note' : 'New Note'} size="lg">
        <div className="space-y-4">
          <Input label="Title" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Note title" />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Content (Markdown supported)</label>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your note here... Supports **bold**, *italic*, `code`, and ```code blocks```"
              rows={10}
              className="w-full px-4 py-3 bg-card border border-white/[0.06] rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/[0.3] focus:border-primary/[0.15] transition-all resize-none font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {noteTags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs">
                  {tag}
                  <button onClick={() => removeTag(tag)}><X size={12} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
              <Button variant="secondary" onClick={addTag}>Add</Button>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={notePinned} onChange={(e) => setNotePinned(e.target.checked)} className="w-4 h-4 rounded border-white/[0.06] bg-card text-primary focus:ring-primary/[0.3]" />
            <Pin size={14} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">Pin this note</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowEditor(false)} className="flex-1">Cancel</Button>
            <Button onClick={saveNote} className="flex-1">{editingNote ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      {/* Folder Modal */}
      <Modal isOpen={showFolderModal} onClose={() => setShowFolderModal(false)} title="New Folder" size="sm">
        <div className="space-y-4">
          <Input label="Folder Name" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="e.g. Math Notes" />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowFolderModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={createFolder} className="flex-1">Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
