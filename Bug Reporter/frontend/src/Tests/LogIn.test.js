import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogIn from '../Components/LogIn';

describe('LogIn Component', () => {
    beforeEach(() => {
        // mock pentru fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    token: 'mockToken',
                    userId: '9',
                    role: 'USER',
                    username: 'dan05',
                }),
            })
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('login cu date valide', async () => {
        const onSuccess = jest.fn();

        render(<LogIn open={true} onClose={() => {}} onSuccess={onSuccess} />);

        fireEvent.change(screen.getByPlaceholderText(/username/i), {
            target: { value: 'dan05' },
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: '1234567' },
        });

        fireEvent.click(screen.getByText(/login/i));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/user/login', expect.any(Object));
            expect(onSuccess).toHaveBeenCalledWith('dan05');
        });
    });

    test('afișează eroare la login invalid', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => Promise.resolve("Invalid credentials"),
            })
        );

        render(<LogIn open={true} onClose={() => {}} onSuccess={() => {}} />);

        fireEvent.change(screen.getByPlaceholderText(/username/i), {
            target: { value: 'wrong' },
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: 'wrong' },
        });

        fireEvent.click(screen.getByText(/login/i));

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });
});
