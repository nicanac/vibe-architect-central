import { DirectoryShell } from '@/components/vibe/DirectoryLayout'
import { HomePageContent } from '@/components/vibe/HomePageContent'
import { CommandSearch } from '@/components/vibe/CommandSearch'
import { getTools, getPrompts } from '@/lib/supabase/queries'
import { getUserFavorites } from '@/app/actions/favorites'
import { Header } from '@/components/layout/Header'

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const [tools, prompts, favorites] = await Promise.all([
    getTools(),
    getPrompts(),
    getUserFavorites(),
  ]);

  return (
    <>
      <Header />
      <DirectoryShell 
        title="Vibe Architect Central"
        description="Discover cutting-edge tools and orchestration prompts for Senior Vibe Architects"
        searchSlot={<CommandSearch tools={tools} prompts={prompts} />}
      >
        <HomePageContent 
          tools={tools} 
          prompts={prompts} 
          favoriteToolIds={favorites.toolIds}
          favoritePromptIds={favorites.promptIds}
        />
      </DirectoryShell>
    </>
  )
}
