import type { ReactNode } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-gray-600/75 flex items-center justify-center p-4 z-50"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="relative transform transition-all sm:align-middle sm:max-w-2xl sm:w-full"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >
        {children}
      </div>
    </div>
  )
}
