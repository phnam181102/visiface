import { useState } from 'react';

import Button from '../../ui/Button';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import SpinnerMini from '../../ui/SpinnerMini';
import FormRowVertical from '../../ui/FormRowVertical';
import { useLogin } from './useLogin';

function LoginForm() {
    const { login, isLoading } = useLogin();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!email || !password) return;

        login(
            { email, password },
            {
                onSettled: () => {
                    setEmail('');
                    setPassword('');
                },
            }
        );
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FormRowVertical label="Email address">
                <Input
                    type="email"
                    id="email"
                    // This makes this form better for password managers
                    autoComplete="username"
                    placeholder="example@example.com"
                    value={email}
                    disabled={isLoading}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormRowVertical>
            <FormRowVertical label="Password">
                <Input
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    disabled={isLoading}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FormRowVertical>
            <FormRowVertical>
                <Button size="large" disabled={isLoading}>
                    {!isLoading ? 'Login' : <SpinnerMini />}
                </Button>
            </FormRowVertical>
        </Form>
    );
}

export default LoginForm;