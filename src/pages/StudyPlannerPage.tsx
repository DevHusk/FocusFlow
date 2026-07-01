import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, BookOpen, Trash2, Edit3, ChevronDown, ChevronRight,
  Target, Calendar, Clock, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import EmptyState from '@/components/ui/EmptyState';
import { generateId, cn, calculateProgress } from '@/utils';
import { SUBJECT_COLORS } from '@/constants';
import type { Subject, Topic, Deadline } from '@/types';

export default function StudyPlannerPage() {
  const { state, dispatch } = useApp();
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // Subject form
  const [subjectName, setSubjectName] = useState('');
  const [subjectColor, setSubjectColor] = useState<string>(SUBJECT_COLORS[0]);
  const [subjectPriority, setSubjectPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [subjectTargetHours, setSubjectTargetHours] = useState(40);

  // Topic form
  const [topicName, setTopicName] = useState('');

  // Deadline form
  const [deadlineTitle, setDeadlineTitle] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineType, setDeadlineType] = useState<'exam' | 'assignment' | 'project' | 'other'>('exam');

  const handleSaveSubject = () => {
    if (!subjectName.trim()) return;
    if (editingSubject) {
      dispatch({
        type: 'UPDATE_SUBJECT',
        payload: {
          ...editingSubject,
          name: subjectName,
          color: subjectColor,
          priority: subjectPriority,
          targetHours: subjectTargetHours,
          updatedAt: new Date().toISOString(),
        },
      });
    } else {
      dispatch({
        type: 'ADD_SUBJECT',
        payload: {
          id: generateId(),
          name: subjectName,
          color: subjectColor,
          priority: subjectPriority,
          targetHours: subjectTargetHours,
          completedHours: 0,
          topics: [],
          deadlines: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
    setShowSubjectModal(false);
    setSubjectName('');
  };

  const addTopic = () => {
    if (!topicName.trim() || !selectedSubjectId) return;
    const subject = state.subjects.find(s => s.id === selectedSubjectId);
    if (!subject) return;
    dispatch({
      type: 'UPDATE_SUBJECT',
      payload: {
        ...subject,
        topics: [...subject.topics, {
          id: generateId(),
          name: topicName,
          completed: false,
          subjectId: selectedSubjectId,
        }],
        updatedAt: new Date().toISOString(),
      },
    });
    setTopicName('');
    setShowTopicModal(false);
  };

  const addDeadline = () => {
    if (!deadlineTitle.trim() || !selectedSubjectId) return;
    const subject = state.subjects.find(s => s.id === selectedSubjectId);
    if (!subject) return;
    dispatch({
      type: 'UPDATE_SUBJECT',
      payload: {
        ...subject,
        deadlines: [...subject.deadlines, {
          id: generateId(),
          title: deadlineTitle,
          date: deadlineDate,
          subjectId: selectedSubjectId,
          type: deadlineType,
          completed: false,
        }],
        updatedAt: new Date().toISOString(),
      },
    });
    // Also add to calendar
    dispatch({
      type: 'ADD_CALENDAR_EVENT',
      payload: {
        id: generateId(),
        title: deadlineTitle,
        date: deadlineDate,
        type: deadlineType === 'exam' ? 'exam' : deadlineType === 'assignment' ? 'assignment' : 'deadline',
        color: subject.color,
        subjectId: selectedSubjectId,
      },
    });
    setDeadlineTitle('');
    setDeadlineDate('');
    setShowDeadlineModal(false);
  };

  const toggleTopic = (subjectId: string, topicId: string) => {
    const subject = state.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    dispatch({
      type: 'UPDATE_SUBJECT',
      payload: {
        ...subject,
        topics: subject.topics.map(t =>
          t.id === topicId ? { ...t, completed: !t.completed } : t
        ),
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const deleteSubject = (id: string) => {
    dispatch({ type: 'DELETE_SUBJECT', payload: id });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Study Planner</h1>
          <p className="text-sm text-text-secondary mt-1">Organize your subjects, topics, and deadlines</p>
        </div>
        <Button onClick={() => { setEditingSubject(null); setSubjectName(''); setShowSubjectModal(true); }}>
          <Plus size={16} /> New Subject
        </Button>
      </div>

      {state.subjects.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={28} />}
          title="No subjects yet"
          description="Create your first subject to start planning your studies"
          action={<Button onClick={() => setShowSubjectModal(true)}><Plus size={16} /> Create Subject</Button>}
        />
      ) : (
        <div className="space-y-4">
          {state.subjects.map(subject => {
            const progress = calculateProgress(subject.completedHours, subject.targetHours);
            const completedTopics = subject.topics.filter(t => t.completed).length;
            const isExpanded = expandedSubject === subject.id;

            return (
              <Card key={subject.id} className="overflow-hidden">
                {/* Subject header */}
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                >
                  <div className="w-3 h-8 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-text">{subject.name}</h3>
                      <Badge variant={subject.priority === 'high' ? 'warning' : subject.priority === 'medium' ? 'primary' : 'default'}>
                        {subject.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-text-tertiary">{subject.topics.length} topics</span>
                      <span className="text-xs text-text-tertiary">{completedTopics}/{subject.topics.length} done</span>
                      <span className="text-xs text-text-tertiary">{subject.completedHours}/{subject.targetHours}h</span>
                    </div>
                  </div>
                  <ProgressBar value={subject.completedHours} max={subject.targetHours} color={subject.color} size="sm" className="w-32 hidden sm:block" />
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditingSubject(subject); setSubjectName(subject.name); setSubjectColor(subject.color); setSubjectPriority(subject.priority); setSubjectTargetHours(subject.targetHours); setShowSubjectModal(true); }}>
                      <Edit3 size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-danger" onClick={(e) => { e.stopPropagation(); deleteSubject(subject.id); }}>
                      <Trash2 size={14} />
                    </Button>
                    {isExpanded ? <ChevronDown size={16} className="text-text-tertiary" /> : <ChevronRight size={16} className="text-text-tertiary" />}
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-border">
                        <ProgressBar value={subject.completedHours} max={subject.targetHours} color={subject.color} showLabel />

                        {/* Topics */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-text-secondary">Topics</h4>
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedSubjectId(subject.id); setShowTopicModal(true); }}>
                              <Plus size={14} /> Add Topic
                            </Button>
                          </div>
                          {subject.topics.length === 0 ? (
                            <p className="text-xs text-text-muted">No topics yet</p>
                          ) : (
                            <div className="space-y-1">
                              {subject.topics.map(topic => (
                                <div key={topic.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-bg-elevated transition-colors">
                                  <button
                                    onClick={() => toggleTopic(subject.id, topic.id)}
                                    className={cn('w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                                      topic.completed ? 'border-success bg-success' : 'border-text-muted'
                                    )}
                                  >
                                    {topic.completed && <CheckCircle2 size={12} className="text-white" />}
                                  </button>
                                  <span className={cn('text-sm', topic.completed ? 'line-through text-text-muted' : 'text-text')}>
                                    {topic.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Deadlines */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-text-secondary">Deadlines</h4>
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedSubjectId(subject.id); setShowDeadlineModal(true); }}>
                              <Plus size={14} /> Add Deadline
                            </Button>
                          </div>
                          {subject.deadlines.length === 0 ? (
                            <p className="text-xs text-text-muted">No deadlines yet</p>
                          ) : (
                            <div className="space-y-1">
                              {subject.deadlines.map(dl => (
                                <div key={dl.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-bg-elevated">
                                  <Calendar size={12} style={{ color: subject.color }} />
                                  <span className="text-sm text-text flex-1">{dl.title}</span>
                                  <span className="text-xs text-text-tertiary">{new Date(dl.date).toLocaleDateString()}</span>
                                  <Badge variant={dl.type === 'exam' ? 'danger' : 'warning'} size="sm">{dl.type}</Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      )}

      {/* Subject Modal */}
      <Modal isOpen={showSubjectModal} onClose={() => setShowSubjectModal(false)} title={editingSubject ? 'Edit Subject' : 'New Subject'}>
        <div className="space-y-4">
          <Input label="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="e.g. Mathematics" />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Color</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setSubjectColor(color)}
                  className={cn('w-8 h-8 rounded-lg transition-all', subjectColor === color && 'ring-2 ring-offset-2 ring-offset-bg-card')}
                  style={{ backgroundColor: color, '--tw-ring-color': color } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={subjectPriority}
              onChange={(e) => setSubjectPriority(e.target.value as 'low' | 'medium' | 'high')}
              options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]}
            />
            <Input label="Target Hours" type="number" value={String(subjectTargetHours)} onChange={(e) => setSubjectTargetHours(Number(e.target.value))} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowSubjectModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSaveSubject} className="flex-1">{editingSubject ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      {/* Topic Modal */}
      <Modal isOpen={showTopicModal} onClose={() => setShowTopicModal(false)} title="Add Topic" size="sm">
        <div className="space-y-4">
          <Input label="Topic Name" value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="e.g. Calculus" />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowTopicModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={addTopic} className="flex-1">Add</Button>
          </div>
        </div>
      </Modal>

      {/* Deadline Modal */}
      <Modal isOpen={showDeadlineModal} onClose={() => setShowDeadlineModal(false)} title="Add Deadline" size="sm">
        <div className="space-y-4">
          <Input label="Title" value={deadlineTitle} onChange={(e) => setDeadlineTitle(e.target.value)} placeholder="e.g. Mid-term Exam" />
          <Input label="Date" type="date" value={deadlineDate} onChange={(e) => setDeadlineDate(e.target.value)} />
          <Select
            label="Type"
            value={deadlineType}
            onChange={(e) => setDeadlineType(e.target.value as any)}
            options={[{ value: 'exam', label: 'Exam' }, { value: 'assignment', label: 'Assignment' }, { value: 'project', label: 'Project' }, { value: 'other', label: 'Other' }]}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowDeadlineModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={addDeadline} className="flex-1">Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
