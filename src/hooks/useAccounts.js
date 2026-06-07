import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { encrypt, decrypt } from '@/lib/encryption'
import { notify } from '@/lib/notifications'

export function useAccounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setAccounts(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const createAccount = useCallback(async (values) => {
    const payload = {
      platform_name: values.platform_name.trim(),
      email: values.email?.trim() || null,
      username: values.username?.trim() || null,
      encrypted_password: encrypt(values.password),
      description: values.description?.trim() || null,
    }

    const { data, error } = await supabase
      .from('accounts')
      .insert([payload])
      .select()
      .single()

    if (error) {
      notify.error('Failed to Create', error.message)
      return { error }
    }

    setAccounts((prev) => [data, ...prev])
    notify.accountCreated()
    return { data }
  }, [])

  const updateAccount = useCallback(async (id, values) => {
    const payload = {
      platform_name: values.platform_name.trim(),
      email: values.email?.trim() || null,
      username: values.username?.trim() || null,
      description: values.description?.trim() || null,
    }

    // Only re-encrypt if a new password was provided
    if (values.password) {
      payload.encrypted_password = encrypt(values.password)
    }

    const { data, error } = await supabase
      .from('accounts')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      notify.error('Failed to Update', error.message)
      return { error }
    }

    setAccounts((prev) => prev.map((a) => (a.id === id ? data : a)))
    notify.accountUpdated()
    return { data }
  }, [])

  const deleteAccount = useCallback(async (id) => {
    const result = await notify.confirm({
      title: 'Delete Account?',
      text: 'This action cannot be undone.',
      confirmText: 'Delete',
      icon: 'warning',
    })

    if (!result.isConfirmed) return { cancelled: true }

    const { error } = await supabase.from('accounts').delete().eq('id', id)

    if (error) {
      notify.error('Failed to Delete', error.message)
      return { error }
    }

    setAccounts((prev) => prev.filter((a) => a.id !== id))
    notify.accountDeleted()
    return { success: true }
  }, [])

  // Decrypt a single account's password for display
  const getDecryptedPassword = useCallback((encryptedPassword) => {
    return decrypt(encryptedPassword)
  }, [])

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getDecryptedPassword,
  }
}
