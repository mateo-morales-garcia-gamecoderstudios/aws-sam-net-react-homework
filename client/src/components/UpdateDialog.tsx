import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RewardSchema } from '@/data/rewards-data';
import { useRewardForm } from '@/hooks/update-reward.form';
import { apiFetch } from '@/lib/api';
import { type UseNavigateResult } from '@tanstack/react-router';
import React from 'react';

export function UpdateDialog({ isOpen, onOpenChange, onUpdate, initialRewardData }: {
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    onUpdate: (value: RewardSchema) => Promise<void>,
    initialRewardData?: RewardSchema,
}) {
    const form = useRewardForm({
        defaultValues: initialRewardData,
        validators: {
            onBlur: RewardSchema,
        },
        onSubmit: async ({ value }) => {
            await onUpdate(value);
        },
    });

    React.useEffect(() => {
        form.reset(initialRewardData);
    }, [initialRewardData]);

    return <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Reward</DialogTitle>
                <DialogDescription>
                    Make changes to the reward here. Click save when you're done.
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
                        <form.SubscribeButton label="Save" />
                    </form.AppForm>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
}

export function useUpdateDialog({ navigate }: { navigate: UseNavigateResult<'/'> }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [initialRewardData, setInitialRewardData] = React.useState<RewardSchema>();

    const openUpdateDialog = React.useCallback((rawReward: RewardSchema) => {
        const { success, data, error } = RewardSchema.safeParse(rawReward);
        if (!success) {
            alert(`${error.message}`);
            return;
        }
        setInitialRewardData(data);
        setIsOpen(true);
    }, [setInitialRewardData, setIsOpen]);

    const onOpenChange = React.useCallback((newOpenValue: boolean) => {
        if (!newOpenValue) {
            setInitialRewardData(undefined);
        }
        setIsOpen(newOpenValue);
    }, [setInitialRewardData, setIsOpen]);

    const onUpdate = React.useCallback(async (reward: RewardSchema) => {
        try {
            const response = await apiFetch(`reward/`, { method: 'PUT', body: JSON.stringify(reward) });
            if (!response.ok) {
                console.error(`Not found reward to update ${reward?.Id}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsOpen(false);
            navigate({
                search: (prev) => ({ ...prev }),
            });
        }
    }, [initialRewardData]);

    return {
        isOpen, onOpenChange,
        onUpdate,
        openUpdateDialog,
        initialRewardData,
    };
}
