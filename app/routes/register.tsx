import { Form } from '@remix-run/react';
import { FormContextProvider } from 'remix-validity-state'
import LoginRegisterBackground from '~/components/logiinregister';


export default function RegistrationRoute() {
    return (
        <LoginRegisterBackground>

            <Form>
                <div>registration form is here</div>
            </Form>
        </LoginRegisterBackground>
    )
}