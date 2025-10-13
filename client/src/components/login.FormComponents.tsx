import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFieldContext, useFormContext } from '@/hooks/login.form-context';
import { useStore } from '@tanstack/react-form';

export function SubscribeButton({ label }: { label: string }) {
    const form = useFormContext();
    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                    {label}
                </Button>
            )}
        </form.Subscribe>
    );
}

function ErrorMessages({
    errors,
}: {
    errors: Array<string | { message: string }>;
}) {
    return (
        <>
            {errors.map((error) => (
                <div
                    key={typeof error === 'string' ? error : error.message}
                    className="text-red-500 mt-1 font-bold"
                >
                    {typeof error === 'string' ? error : error.message}
                </div>
            ))}
        </>
    );
}

export function TextField({
    label,
    placeholder,
}: {
    label: string;
    placeholder?: string;
}) {
    const field = useFieldContext<string>();
    const errors = useStore(field.store, (state) => state.meta.errors);

    return (
        <div>
            <Label htmlFor={label} className="mb-2 text-xl font-bold">
                {label}
            </Label>
            <Input
                value={field.state.value}
                placeholder={placeholder}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
        </div>
    );
}

export function NumericField({
    label,
    placeholder,
}: {
    label: string;
    placeholder?: string;
}) {
    const field = useFieldContext<number>();
    const errors = useStore(field.store, (state) => state.meta.errors);

    return (
        <div>
            <Label htmlFor={label} className="mb-2 text-xl font-bold">
                {label}
            </Label>
            <Input
                type='number'
                value={field.state.value}
                placeholder={placeholder}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
            />
            {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
        </div>
    );
}

export function PasswordField({
    label,
    placeholder,
}: {
    label: string;
    placeholder?: string;
}) {
    const field = useFieldContext<string>();
    const errors = useStore(field.store, (state) => state.meta.errors);

    return (
        <div>
            <Label htmlFor={label} className="mb-2 text-xl font-bold">
                {label}
            </Label>
            <Input
                type='password'
                value={field.state.value}
                placeholder={placeholder}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
        </div>
    );
}
