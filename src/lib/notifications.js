import Swal from 'sweetalert2'

// --- Toast (non-blocking, top-right) ----------------------------------------
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

// --- Confirmation dialog -----------------------------------------------------
function confirm({ title, text, icon = 'warning', confirmText = 'Confirm', cancelText = 'Cancel' }) {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#6366f1',
    reverseButtons: true,
    focusCancel: true,
  })
}

// --- Exported helper ---------------------------------------------------------
export const notify = {
  success: (title, text) => Toast.fire({ icon: 'success', title, text }),
  error: (title, text) => Toast.fire({ icon: 'error', title, text }),
  warning: (title, text) => Toast.fire({ icon: 'warning', title, text }),
  info: (title, text) => Toast.fire({ icon: 'info', title, text }),

  confirm,

  accountCreated: () => notify.success('Account Created!', 'Your credentials have been saved securely.'),
  accountUpdated: () => notify.success('Account Updated!', 'Your changes have been saved.'),
  accountDeleted: () => notify.success('Account Deleted!', 'The account has been removed.'),
  passwordChanged: () => notify.success('Password Changed!', 'Your admin password has been updated.'),
  loginSuccess: (name) => notify.success('Welcome back!', name || undefined),
  loginFailed: (msg) => notify.error('Login Failed', msg || 'Invalid email or password.'),
  scheduleCreated: () => notify.success('Event Created!', 'Your event has been added to the calendar.'),
  scheduleUpdated: () => notify.success('Event Updated!', 'Your event has been updated.'),
  scheduleDeleted: () => notify.success('Event Deleted!', 'The event has been removed from the calendar.'),
}