import { useState } from 'react'
import { Plus, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { useSchedules } from '@/hooks/useSchedules'
import CalendarView from '@/components/calendar/CalendarView'
import EventForm from '@/components/calendar/EventForm'
import Modal from '@/components/ui/Modal'

export default function Calendar() {
  const { schedules, loading, createSchedule, updateSchedule, deleteSchedule, toCalendarEvents } = useSchedules()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [defaultDate, setDefaultDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const openCreate = (date = '') => {
    setEditTarget(null)
    setDefaultDate(date)
    setModalOpen(true)
  }

  const openEdit = (schedule) => {
    setEditTarget(schedule)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    if (editTarget) {
      await updateSchedule(editTarget.id, values)
    } else {
      await createSchedule(values)
    }
    setSubmitting(false)
    closeModal()
  }

  const handleDateClick = ({ dateStr }) => openCreate(dateStr)

  const handleEventClick = ({ event }) => {
    openEdit(event.extendedProps.raw)
  }

  const handleEventDrop = async ({ event }) => {
    const raw = event.extendedProps.raw
    const newDate = event.startStr.split('T')[0]
    const newTime = event.start && !event.allDay
      ? event.start.toTimeString().slice(0, 5)
      : raw.time
    await updateSchedule(raw.id, { ...raw, date: newDate, time: newTime })
  }

  // Upcoming events (next 7 days)
  const upcoming = schedules
    .filter((s) => {
      const d = new Date(s.date)
      const now = new Date()
      const in7 = new Date()
      in7.setDate(now.getDate() + 7)
      return d >= now && d <= in7
    })
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Calendar</h2>
          <p className="page-subtitle">{schedules.length} event{schedules.length !== 1 ? 's' : ''} scheduled</p>
        </div>
        <button onClick={() => openCreate()} className="btn-primary">
          <Plus size={16} />
          New Event
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar (main) */}
        <div className="xl:col-span-3">
          {loading ? (
            <div className="glass-card flex items-center justify-center h-96">
              <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : (
            <CalendarView
              events={toCalendarEvents()}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              onEventDrop={handleEventDrop}
            />
          )}
        </div>

        {/* Upcoming sidebar */}
        <div className="space-y-4">
          <div className="glass-card p-4">
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <CalendarDays size={16} className="text-indigo-400" />
              Upcoming (7 days)
            </h3>
            {upcoming.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-4">No upcoming events</p>
            ) : (
              <div className="space-y-2">
                {upcoming.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => openEdit(s)}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                        style={{ backgroundColor: s.color || '#6366f1' }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-300 truncate group-hover:text-slate-100">
                          {s.title}
                        </p>
                        <p className="text-xs text-slate-600">
                          {format(new Date(s.date), 'EEE, MMM d')}
                          {s.time && ` · ${s.time.slice(0, 5)}`}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick add */}
          <button
            onClick={() => openCreate()}
            className="w-full glass-card p-4 text-center text-slate-500 hover:text-slate-300
              hover:border-slate-600 transition-all duration-200 border-dashed"
          >
            <Plus size={20} className="mx-auto mb-1" />
            <span className="text-sm">Add Event</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? `Edit — ${editTarget.title}` : 'New Event'}
        size="md"
      >
        <EventForm
          schedule={editTarget}
          defaultDate={defaultDate}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>
    </div>
  )
}