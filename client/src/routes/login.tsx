import { useAppForm } from '@/hooks/login.form';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/manage'/* fallback */ });
    }
  },
  component: LoginComponent,
})

const schema = z.object({
  Email: z.email().min(1, 'e-mail is required'),
  Password: z.string().min(1, 'password is required'),
});

function LoginComponent() {
  const router = useRouter();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const { checkSession } = useAuth();
  const form = useAppForm({
    defaultValues: {
      Email: '',
      Password: '',
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: async ({ value }) => {
      await apiFetch('login', {
        method: 'POST',
        body: JSON.stringify(value),
      });
      await checkSession();

      await router.invalidate();
      await navigate({ to: search.redirect || '/manage' });
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
        <form.AppField name="Email">
          {(field) => <field.TextField label="e-mail" />}
        </form.AppField>

        <form.AppField name="Password">
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
