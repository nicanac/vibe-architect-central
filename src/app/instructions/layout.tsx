
import { InstructionSidebar } from '@/components/vibe/InstructionSidebar';

export default function InstructionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            {/* Fixed Sidebar */}
            <aside className="hidden md:block flex-shrink-0">
                <InstructionSidebar />
            </aside>
            
            {/* Main Content - with proper padding */}
            <main className="flex-1 min-w-0 p-8 lg:p-12">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
