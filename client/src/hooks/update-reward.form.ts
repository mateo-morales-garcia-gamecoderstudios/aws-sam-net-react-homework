import { createFormHook } from '@tanstack/react-form';

import {
    NumericField,
    SubscribeButton,
    TextField
} from '../components/login.FormComponents';
import { fieldContext, formContext } from './update-reward.form-context';

export const { useAppForm: useRewardForm } = createFormHook({
    fieldComponents: {
        TextField,
        NumericField,
    },
    formComponents: {
        SubscribeButton,
    },
    fieldContext,
    formContext,
});
