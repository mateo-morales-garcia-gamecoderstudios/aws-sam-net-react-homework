import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RewardSchemaIdField } from '@/data/rewards-data';
import { apiFetch } from '@/lib/api';
import { type UseNavigateResult } from '@tanstack/react-router';
import React from 'react';

export function DeleteDialog({ isOpen, onOpenChange, onDelete }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onDelete: () => Promise<void> }) {
    return <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" variant={'destructive'} onClick={onDelete}>Yes, Delete</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

export function useDeleteDialog({ navigate }: { navigate: UseNavigateResult<'/'> }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [id, setId] = React.useState<string>();

    const openDeleteDialog = React.useCallback((rawId: string) => {
        const { success, data, error } = RewardSchemaIdField.safeParse(rawId);
        if (!success) {
            alert(`${error.message}`);
            return;
        }
        setId(data);
        setIsOpen(true);
    }, [setId, setIsOpen]);

    const onOpenChange = React.useCallback((newOpenValue: boolean) => {
        if (!newOpenValue) {
            setId(undefined);
        }
        setIsOpen(newOpenValue);
    }, [setId, setIsOpen]);

    const onDelete = React.useCallback(async () => {
        try {
            const response = await apiFetch(`reward/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                console.error(`Not found reward to delete ${id}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsOpen(false);
            navigate({
                search: (prev) => ({ ...prev }),
            });
        }
    }, [id]);

    return {
        isOpen, onOpenChange,
        onDelete,
        openDeleteDialog,
    };
}
