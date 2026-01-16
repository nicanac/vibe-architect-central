"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export function InstructionSearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // State for search input
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Effect to handle URL updates when debounced search term changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to page 1 on search
    
    // Only replace if the search param actually changed to avoid redundant pushes
    const currentSearch = searchParams.get("search") || "";
    if (currentSearch !== debouncedSearchTerm) {
         router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearchTerm, pathname, router, searchParams]);

  // Placeholder for filter logic - implementing UI first
  // Leaving unused for now as placeholders for future 'Filter' functionality
  // const activeFilters = [];

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between border border-[var(--terminal-border)] p-2 bg-[var(--terminal-card)]">
        {/* Left Side: Filter Button & Active Filters */}
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto selection-none">
            <Button 
                variant="outline" 
                className="h-10 gap-2 bg-[var(--terminal-green)] text-black hover:bg-[var(--terminal-green)]/90 hover:text-black border-none font-bold tracking-wider"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
                <SlidersHorizontal className="h-4 w-4" />
                FILTER
            </Button>
            
            <div className="flex items-center gap-2 border-l border-[var(--terminal-border)] pl-4">
               {/* Hardcoded visual filters for future implementation - commented out to fix lints
               <div className="flex items-center gap-2 px-3 py-1 bg-[var(--terminal-surface)] border border-[var(--terminal-green)] text-[var(--terminal-green)] text-xs font-mono">
                    BESTSELLING
                    <X className="h-3 w-3 cursor-pointer hover:text-white" />
               </div>
               */}
               <span className="text-[var(--terminal-text-muted)] text-xs font-mono">NO ACTIVE FILTERS</span>
            </div>
        </div>

        {/* Right Side: Search Bar */}
        <div className="relative w-full md:w-[400px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--terminal-text-muted)] z-10 pointer-events-none">
                 {/* Only show label if empty */}
                 {searchTerm.length === 0 && <span className="font-mono text-xs">SEARCH...</span>}
            </div>
            <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-3 pr-10 bg-black border border-[var(--terminal-border)] text-[var(--terminal-green)] placeholder:text-transparent focus-visible:ring-[var(--terminal-green)] rounded-none font-mono relative z-0"
                aria-label="Search instructions"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--terminal-green)] z-10" />
            
            {/* Clear button if search is active */}
            {searchTerm && (
                <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-[var(--terminal-text-muted)] hover:text-white z-20"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </div>
    </div>
  );
}
