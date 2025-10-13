import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RewardSchemaNoId } from '@/data/rewards-data';
import { useRewardForm } from '@/hooks/update-reward.form';
import { apiFetch } from '@/lib/api';
import { type UseNavigateResult } from '@tanstack/react-router';
import React from 'react';

export function CreateDialog({ isOpen, onOpenChange, onCreate }: {
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    onCreate: (value: RewardSchemaNoId) => Promise<void>,
}) {
    const form = useRewardForm({
        defaultValues: {
            Name: '',
            Description: '',
            Price: 0,
            Category: '',
            ImageUrl: '',
        },
        validators: {
            onBlur: RewardSchemaNoId,
        },
        onSubmit: async ({ value }) => {
            await onCreate(value);
            form.reset();
        },
    });

    return <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create Reward</DialogTitle>
                <DialogDescription>
                    Make a new reward here. Click create when you're done.
                </DialogDescription>
            </DialogHeader>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <form.AppField name="Name">
                    {(field) => <field.TextField label="Name" />}
                </form.AppField>
                <form.AppField name="Description">
                    {(field) => <field.TextField label="Description" />}
                </form.AppField>
                <form.AppField name="Price">
                    {(field) => <field.NumericField label="Price" />}
                </form.AppField>
                <form.AppField name="Category">
                    {(field) => <field.TextField label="Category" />}
                </form.AppField>
                <form.AppField name="ImageUrl">
                    {(field) => <field.TextField label="Image Url" />}
                </form.AppField>
                <DialogFooter className='mt-5'>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <form.AppForm>
                        <form.SubscribeButton label="Create" />
                    </form.AppForm>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
}

export function useCreateDialog({ navigate }: { navigate: UseNavigateResult<'/'> }) {
    const [isOpen, setIsOpen] = React.useState(false);

    const onCreate = React.useCallback(async (reward: RewardSchemaNoId) => {
        try {
            const response = await apiFetch(`reward/`, { method: 'POST', body: JSON.stringify(reward) });
            console.log(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsOpen(false);
            navigate({
                search: (prev) => ({ ...prev }),
            });
        }
    }, []);

    return {
        isOpen, onOpenChange: setIsOpen,
        onCreate,
        openUpdateDialog: () => setIsOpen(true),
    };
}
