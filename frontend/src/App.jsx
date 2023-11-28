import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import AppLayout from './ui/AppLayout';
import ProtectedRoute from './ui/ProtectedRoute';

import { DarkModeProvider } from './context/DarkModeContext';

import Users from './pages/Users';
import MyClasses from './pages/MyClasses';
import NewStudent from './pages/NewStudent';
import Profile from './pages/Profile';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import GlobalStyles from './styles/GlobalStyles';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
        },
    },
});

function App() {
    return (
        <DarkModeProvider>
            <QueryClientProvider client={queryClient}>
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}

                <GlobalStyles />

                <BrowserRouter>
                    <Routes>
                        <Route
                            element={
                                <ProtectedRoute>
                                    <AppLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route
                                index
                                element={<Navigate replace to="/my-classes" />}
                            />
                            <Route path="my-classes" element={<MyClasses />} />
                            <Route
                                path="create-student"
                                element={<NewStudent />}
                            />
                            <Route path="users" element={<Users />} />
                            <Route path="profile" element={<Profile />} />
                        </Route>

                        <Route path="login" element={<Login />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </BrowserRouter>

                <Toaster
                    position="top-center"
                    gutter={12}
                    containerStyle={{ margin: '8px' }}
                    toastOptions={{
                        success: {
                            duration: 3000,
                        },
                        error: {
                            duration: 5000,
                        },
                        style: {
                            fontSize: '16px',
                            maxWidth: '500px',
                            padding: '16px 24px',
                            backgroundColor: 'var(--color-grey-0)',
                            color: 'var(--color-grey-700)',
                        },
                    }}
                />
            </QueryClientProvider>
        </DarkModeProvider>
    );
}

export default App;
