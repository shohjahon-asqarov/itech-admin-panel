import React from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from './dialog';
import { Button } from './button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title = 'Tasdiqlash',
    description = 'Ushbu amalni bajarishni xohlaysizmi?',
    confirmText = `Ha, tasdiqlayman`,
    cancelText = 'Bekor qilish',
    loading = false,
    onConfirm,
    onCancel,
}) => {
    return (
        <Dialog open={open} onOpenChange={v => { if (!v) onCancel(); }}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <div className="flex items-center justify-center mb-2">
                        <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    </div>
                    <DialogTitle className="text-center">{title}</DialogTitle>
                    <DialogDescription className="text-center">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row gap-2 justify-center mt-4">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                        className="min-w-[100px]"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        loading={loading}
                        className="min-w-[120px]"
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}; 