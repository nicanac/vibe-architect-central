
import { InstructionSidebar } from '@/components/vibe/InstructionSidebar';

export default function InstructionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto px-4">
            <div className="flex min-h-[calc(100vh-4rem)]">
                {/* Fixed Sidebar */}
                <aside className="hidden md:block flex-shrink-0">
                    <InstructionSidebar />
                </aside>
                
                {/* Main Content - with proper padding */}
                <main className="flex-1 min-w-0 p-4 lg:p-2 lg:pr-0 lg:pl-4">
                    {children}
                </main>
            </div>
        </div>
    );
}

