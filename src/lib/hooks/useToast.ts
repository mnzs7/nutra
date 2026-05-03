'use client'

import { useToastStore } from '@/lib/store/toastStore'

export function useToast() {
  return useToastStore()
}
