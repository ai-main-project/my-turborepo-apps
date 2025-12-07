import Link from 'next/link';

export const BaseNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-cyan-400 font-mono">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <Link href="/" className="text-cyan-600 hover:text-cyan-400 underline">
                Return to Elevator
            </Link>
        </div>
    );
};
