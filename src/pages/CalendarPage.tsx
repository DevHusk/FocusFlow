import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon,
  Clock, MapPin, Trash2, X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { generateId, cn } from '@/utils';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday,
} from 'date-fns';
import type { CalendarEvent, EventType } from '@/types';

export default function CalendarPage() {
  const { state, dispatch } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [eventType, setEventType] = useState<EventType>('study');
  const [color, setColor] = useState<string>('#00E5C7');
  const [description, setDescription] = useState('');

  const eventTypeColors: Record<EventType, string> = {
    exam: '#FB7185',
    assignment: '#FBBF24',
    study: '#00E5C7',
    event: '#D946EF',
    deadline: '#D946EF',
  };

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);

    const days = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(new Date(day));
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const getEventsForDate = (d: Date): CalendarEvent[] => {
    return state.calendarEvents.filter(e => isSameDay(new Date(e.date), d));
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Upcoming exams (next 30 days)
  const upcomingExams = useMemo(() => {
    const now = new Date();
    const limit = addDays(now, 30);
    return state.calendarEvents
      .filter(e => e.type === 'exam' && new Date(e.date) >= now && new Date(e.date) <= limit)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [state.calendarEvents]);

  const handleSave = () => {
    if (!title.trim() || !date) return;
    dispatch({
      type: 'ADD_CALENDAR_EVENT',
      payload: {
        id: generateId(), title, date, time: time || undefined,
        endTime: endTime || undefined, type: eventType, color,
        description: description || undefined,
      },
    });
    setShowModal(false);
    setTitle(''); setDate(''); setTime(''); setEndTime('');
    setDescription('');
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Calendar</h1>
          <p className="text-sm text-text-secondary mt-1">Manage your study schedule and deadlines</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-card border border-white/[0.06] rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('month')}
              className={cn('px-3 py-1.5 text-sm font-medium transition-colors', viewMode === 'month' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text')}>
              Month
            </button>
            <button onClick={() => setViewMode('agenda')}
              className={cn('px-3 py-1.5 text-sm font-medium transition-colors', viewMode === 'agenda' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text')}>
              Agenda
            </button>
          </div>
          <Button onClick={() => setShowModal(true)}><Plus size={16} /> Event</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {viewMode === 'month' ? (
            <Card padding="none">
              {/* Month header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-card text-text-secondary">
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-base font-semibold text-text">{format(currentMonth, 'MMMM yyyy')}</h2>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-card text-text-secondary">
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 border-b border-white/[0.06]">
                {dayNames.map(d => (
                  <div key={d} className="text-center text-xs font-medium text-text-tertiary py-2">{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, i) => {
                  const events = getEventsForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const today = isToday(day);

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        'relative min-h-[80px] sm:min-h-[100px] p-1.5 border-b border-r border-white/[0.06] text-left transition-colors hover:bg-card',
                        !isCurrentMonth && 'opacity-30',
                        isSelected && 'bg-primary/5',
                      )}
                    >
                      <span className={cn(
                        'inline-flex items-center justify-center w-7 h-7 text-xs font-medium rounded-full',
                        today && 'bg-primary text-white',
                        isSelected && !today && 'bg-primary/20 text-primary',
                        !today && !isSelected && 'text-text-secondary'
                      )}>
                        {format(day, 'd')}
                      </span>
                      <div className="mt-0.5 space-y-0.5">
                        {events.slice(0, 3).map(event => (
                          <div key={event.id} className="text-[10px] leading-tight px-1 py-0.5 rounded text-white truncate"
                            style={{ backgroundColor: event.color }}>
                            {event.title}
                          </div>
                        ))}
                        {events.length > 3 && (
                          <span className="text-[10px] text-text-muted">+{events.length - 3} more</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          ) : (
            /* Agenda view */
            <div className="space-y-3">
              {state.calendarEvents.length === 0 ? (
                <Card><p className="text-sm text-text-tertiary text-center py-8">No events scheduled</p></Card>
              ) : (
                state.calendarEvents
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .filter(e => new Date(e.date) >= new Date())
                  .slice(0, 20)
                  .map(event => (
                    <Card key={event.id} hover className="flex items-center gap-3">
                      <div className="w-2 h-10 rounded-full shrink-0" style={{ backgroundColor: event.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text">{event.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-text-tertiary flex items-center gap-1">
                            <CalendarIcon size={10} /> {format(new Date(event.date), 'MMM dd, yyyy')}
                          </span>
                          {event.time && (
                            <span className="text-xs text-text-tertiary flex items-center gap-1">
                              <Clock size={10} /> {event.time}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={
                        event.type === 'exam' ? 'danger' :
                        event.type === 'assignment' ? 'warning' :
                        event.type === 'study' ? 'primary' : 'accent'
                      }>{event.type}</Badge>
                    </Card>
                  ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected date events */}
          <Card>
            <h3 className="text-sm font-semibold text-text mb-3">
              {selectedDate ? format(selectedDate, 'EEEE, MMM dd') : 'Select a date'}
            </h3>
            {selectedEvents.length === 0 ? (
              <p className="text-xs text-text-muted py-4 text-center">No events</p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map(event => (
                  <div key={event.id} className="p-2.5 rounded-xl bg-card border border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color }} />
                      <span className="text-sm font-medium text-text">{event.title}</span>
                    </div>
                    {event.time && <p className="text-xs text-text-tertiary mt-1 ml-4">{event.time}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Exam countdown */}
          {upcomingExams.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold text-text mb-3">Exam Countdown</h3>
              <div className="space-y-2">
                {upcomingExams.map(exam => {
                  const daysLeft = Math.ceil((new Date(exam.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={exam.id} className="p-2.5 rounded-xl bg-danger/5 border border-danger/10">
                      <p className="text-sm font-medium text-text">{exam.title}</p>
                      <p className="text-xs text-danger mt-1">{daysLeft} day{daysLeft !== 1 ? 's' : ''} left</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <h3 className="text-sm font-semibold text-text mb-3">Legend</h3>
            <div className="space-y-1.5">
              {Object.entries(eventTypeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-text-secondary capitalize">{type}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Event">
        <div className="space-y-4">
          <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title" />
          <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" type="time" value={time} onChange={e => setTime(e.target.value)} />
            <Input label="End Time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
          <Select label="Type" value={eventType} onChange={e => setEventType(e.target.value as EventType)}
            options={[{ value: 'study', label: 'Study' }, { value: 'exam', label: 'Exam' }, { value: 'assignment', label: 'Assignment' }, { value: 'event', label: 'Event' }, { value: 'deadline', label: 'Deadline' }]} />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Color</label>
            <div className="flex gap-2">
              {Object.values(eventTypeColors).map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className={cn('w-8 h-8 rounded-lg transition-all', color === c && 'ring-2 ring-offset-2 ring-offset-bg-card')}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              className="w-full px-3 py-2.5 bg-card border border-white/[0.06] rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/[0.3] resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} className="flex-1">Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
