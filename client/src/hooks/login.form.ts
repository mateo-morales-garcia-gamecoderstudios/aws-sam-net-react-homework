import { createFormHook } from '@tanstack/react-form';

import {
    PasswordField,
    SubscribeButton,
    TextField
} from '../components/login.FormComponents';
import { fieldContext, formContext } from './login.form-context';

export const { useAppForm } = createFormHook({
    fieldComponents: {
        TextField,
        PasswordField,
    },
    formComponents: {
        SubscribeButton,
    },
    fieldContext,
    formContext,
});
