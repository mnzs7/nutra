'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { generateId } from '@/lib/utils/generateId'
import type { PointsTransaction } from '@/lib/types'

interface PointsStore {
  balance: number
  transactions: PointsTransaction[]

  addPoints: (amount: number, description: string) => void
  redeemPoints: (amount: number, description: string) => boolean
  getHistory: () => PointsTransaction[]
}

const MAX_TRANSACTIONS = 100

export const usePointsStore = create<PointsStore>()(
  persist(
    (set, get) => ({
      balance: 250,
      transactions: [
        {
          id: 'initial',
          date: new Date().toISOString(),
          description: 'Bono de bienvenida',
          points: 250,
          type: 'earned',
        },
      ],

      addPoints: (amount, description) => {
        const transaction: PointsTransaction = {
          id: generateId('txn'),
          date: new Date().toISOString(),
          description,
          points: amount,
          type: 'earned',
        }

        set((state) => ({
          balance: state.balance + amount,
          transactions: [transaction, ...state.transactions].slice(0, MAX_TRANSACTIONS),
        }))
      },

      redeemPoints: (amount, description) => {
        if (get().balance < amount) return false

        const transaction: PointsTransaction = {
          id: generateId('txn'),
          date: new Date().toISOString(),
          description,
          points: amount,
          type: 'redeemed',
        }

        set((state) => ({
          balance: state.balance - amount,
          transactions: [transaction, ...state.transactions].slice(0, MAX_TRANSACTIONS),
        }))

        return true
      },

      getHistory: () => {
        return get().transactions
      },
    }),
    {
      name: 'vitashop-points',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
