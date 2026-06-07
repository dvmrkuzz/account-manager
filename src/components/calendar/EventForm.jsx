import { useState, useEffect } from 'react'

const EVENT_COLORS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#10b981', label: 'Emerald' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#ef4444', label: 'Red' },
  { value: '#64748b', label: 'Slate' },
]

const INITIAL = {
  title: '',
  description: '',
  date: '',
  time: '',
  color: '#6366f1',
}

export default function EventForm({ schedule, defaultDate, onSubmit, onCancel, onDelete, submitting }) {
  const isEdit = Boolean(schedule)
  const [form, setForm] = useState(INITIAL)

  useEffect(() => {
    if (schedule) {
      setForm({
        title: schedule.title || '',
        description: schedule.description || '',
        date: schedule.date || '',
        time: schedule.time || '',
        color: schedule.color || '#6366f1',
      })
    } else {
      setForm({ ...INITIAL, date: defaultDate || '' })
    }
  }, [schedule, defaultDate])

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="input-label">Event Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={set('title')}
          className="input-field"
          placeholder="Meeting, Birthday, Deadline…"
          required
        />
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="input-label">Date *</label>
          <input type="date" value={form.date} onChange={set('date')} className="input-field" required />
        </div>
        <div>
          <label className="input-label">Time</label>
          <input type="time" value={form.time} onChange={set('time')} className="input-field" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="input-label">Description</label>
        <textarea
          value={form.description}
          onChange={set('description')}
          className="input-field resize-none"
          rows={3}
          placeholder="Optional details…"
        />
      </div>

      {/* Color */}
      <div>
        <label className="input-label">Color</label>
        <div className="flex gap-2 flex-wrap">
          {EVENT_COLORS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, color: value }))}
              className={`w-7 h-7 rounded-lg transition-transform duration-150 ${
                form.color === value ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: value }}
              title={label}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2">
        {isEdit && (
          <button
            type="button"
            onClick={() => onDelete(schedule.id)}
            className="btn-danger"
          >
            Delete Event
          </button>
        )}
        <div className={`flex gap-2 ${!isEdit ? 'ml-auto' : ''}`}>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </div>
    </form>
  )
}