import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { notify } from '@/lib/notifications'

export function useSchedules() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSchedules = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setSchedules(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  const createSchedule = useCallback(async (values) => {
    const payload = {
      title: values.title.trim(),
      description: values.description?.trim() || null,
      date: values.date,
      time: values.time || null,
      color: values.color || '#6366f1',
      reminder_settings: {
        remindOnDay: values.remindOnDay !== false,
        remindThreeHours: values.remindThreeHours !== false,
      },
    }

    const { data, error } = await supabase
      .from('schedules')
      .insert([payload])
      .select()
      .single()

    if (error) {
      notify.error('Failed to Create Event', error.message)
      return { error }
    }

    setSchedules((prev) => [...prev, data].sort((a, b) => new Date(a.date) - new Date(b.date)))
    notify.scheduleCreated()
    return { data }
  }, [])

  const updateSchedule = useCallback(async (id, values) => {
    const payload = {
      title: values.title.trim(),
      description: values.description?.trim() || null,
      date: values.date,
      time: values.time || null,
      color: values.color || '#6366f1',
      reminder_settings: {
        remindOnDay: values.remindOnDay !== false,
        remindThreeHours: values.remindThreeHours !== false,
      },
    }

    const { data, error } = await supabase
      .from('schedules')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      notify.error('Failed to Update Event', error.message)
      return { error }
    }

    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? data : s)).sort((a, b) => new Date(a.date) - new Date(b.date))
    )
    notify.scheduleUpdated()
    return { data }
  }, [])

  const deleteSchedule = useCallback(async (id) => {
    const result = await notify.confirm({
      title: 'Delete Event?',
      text: 'This will remove the event from your calendar.',
      confirmText: 'Delete',
      icon: 'warning',
    })

    if (!result.isConfirmed) return { cancelled: true }

    const { error } = await supabase.from('schedules').delete().eq('id', id)

    if (error) {
      notify.error('Failed to Delete', error.message)
      return { error }
    }

    setSchedules((prev) => prev.filter((s) => s.id !== id))
    notify.scheduleDeleted()
    return { success: true }
  }, [])

  // Convert schedules to FullCalendar event format
  const toCalendarEvents = useCallback(
    () =>
      schedules.map((s) => ({
        id: s.id,
        title: s.title,
        start: s.time ? `${s.date}T${s.time}` : s.date,
        allDay: !s.time,
        backgroundColor: s.color || '#6366f1',
        borderColor: s.color || '#6366f1',
        extendedProps: { description: s.description, reminder_settings: s.reminder_settings, raw: s },
      })),
    [schedules]
  )

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    toCalendarEvents,
  }
}
