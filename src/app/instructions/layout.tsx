
import { InstructionSidebar } from '@/components/vibe/InstructionSidebar';

import { Header } from '@/components/layout/Header';

export default function InstructionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    <aside className="hidden md:block">
                        <InstructionSidebar />
                    </aside>
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
