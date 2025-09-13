import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import BusinessExpenseForm from './BusinessExpenseForm';

interface BusinessExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function BusinessExpenseModal({
  isOpen,
  onClose,
  onSubmit,
}: BusinessExpenseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-4xl w-[95vw] max-h-[95vh] overflow-auto">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <BusinessExpenseForm onSubmit={onSubmit} onClose={onClose} />
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}