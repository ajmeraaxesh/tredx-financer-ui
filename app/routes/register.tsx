import { Form } from '@remix-run/react';
import { FormContextProvider } from 'remix-validity-state'
import LoginRegisterBackground from '~/components/logiinregister';

const formValidations = {
    firstName: {
        required: true,
        maxLength: 50,
    },
    middleInitial: {
        pattern: "^[a-zA-Z]{1}$",
    },
    lastName: {
        required: true,
        maxLength: 50,
    },
    emailAddress: {
        type: "email",
        required: true,
        maxLength: 50,
    },
};

export default function RegistrationRoute() {
    return (
        <LoginRegisterBackground>

            <Form>
                <div>registration form is here</div>
            </Form>
        </LoginRegisterBackground>
    )
}