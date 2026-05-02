import { format, formatDistanceToNowStrict, isPast, parseISO } from 'date-fns'
import type { TaskStatus } from '../types'

export function formatDate(value: string) {
  return format(parseISO(value), 'dd MMM yyyy')
}

export function formatRelativeTime(value: string) {
  return formatDistanceToNowStrict(parseISO(value), { addSuffix: true })
}

export function isOverdue(value: string) {
  return isPast(parseISO(`${value}T23:59:59`))
}

export function statusLabel(status: TaskStatus) {
  switch (status) {
    case 'TODO':
      return 'To do'
    case 'IN_PROGRESS':
      return 'In progress'
    case 'DONE':
      return 'Done'
    default:
      return status
  }
}
