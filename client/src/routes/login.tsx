import { useAppForm } from '@/hooks/login.form';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/login')({
  component: LoginComponent,
})

const schema = z.object({
  email: z.email().min(1, 'e-mail is required'),
  password: z.string().min(1, 'password is required'),
});

function LoginComponent() {
  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      // Show success message
      alert('Form submitted successfully!');
    },
  });
  return <div
    className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-cyan-50 p-4 text-white"
  >
    <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/35 shadow-xl border-8 border-black/10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <form.AppField name="email">
          {(field) => <field.TextField label="e-mail" />}
        </form.AppField>

        <form.AppField name="password">
          {(field) => <field.PasswordField label="password" />}
        </form.AppField>

        <div className="flex justify-end">
          <form.AppForm>
            <form.SubscribeButton label="Login" />
          </form.AppForm>
        </div>
      </form>
    </div>
  </div>
}
