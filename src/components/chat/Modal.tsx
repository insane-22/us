"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="z-50">
        <DialogHeader>
          <div className="absolute right-0 top-0 pr-4 pt-4 z-10">
            <button
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Close panel</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          <DialogTitle className="sr-only">Modal</DialogTitle>
        </DialogHeader>
        {children}
        <DialogClose className="sr-only">Close</DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
