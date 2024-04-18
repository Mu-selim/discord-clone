import { ReactNode } from 'react';

export default function AuthLayout({ children }: {children: ReactNode}) {
    return (
        <div className='w-full h-full flex justify-center items-center'>
            {children}
        </div>
    );
}