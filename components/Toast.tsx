'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  }

  const styles = {
    success: 'bg-success text-white border-success',
    error: 'bg-danger text-white border-danger',
    info: 'bg-primary-600 text-white border-primary-600',
    warning: 'bg-yellow-500 text-white border-yellow-500',
  }

  return (
    <div className={`fixed top-4 right-4 z-[100] animate-slide-down`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-glow border-2 ${styles[type]} min-w-[300px] max-w-md`}>
        <div className="flex-shrink-0">{icons[type]}</div>
        <p className="flex-1 font-medium text-sm">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
