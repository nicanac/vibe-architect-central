import { NextRequest, NextResponse } from 'next/server';

// Type for search results
interface SearchResult {
    id: string;
    title: string;
    content: string;
    category: string;
    type: string;
    score: number;
}

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return NextResponse.json(
                { error: 'Query parameter is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.PINECONE_API_KEY;
        if (!apiKey) {
            console.error('PINECONE_API_KEY not configured');
            return NextResponse.json(
                { error: 'Search service not configured' },
                { status: 500 }
            );
        }

        // Pinecone search request
        const searchResponse = await fetch(
            'https://vibe-architect-ai-tools-ozeetk0.svc.aped-4627-b74a.pinecone.io/records/namespaces/docs/search',
            {
                method: 'POST',
                headers: {
                    'Api-Key': apiKey,
                    'Content-Type': 'application/json',
                    'X-Pinecone-API-Version': '2025-01',
                },
                body: JSON.stringify({
                    query: {
                        inputs: { text: query.trim() },
                        top_k: 5,
                    },
                    fields: ['title', 'content', 'category', 'type'],
                }),
            }
        );

        if (!searchResponse.ok) {
            const errorText = await searchResponse.text();
            console.error('Pinecone search error:', errorText);
            return NextResponse.json(
                { error: 'Search request failed' },
                { status: 500 }
            );
        }

        const data = await searchResponse.json();

        // Transform results to our format
        const results: SearchResult[] = (data.result?.hits || []).map(
            (hit: { _id: string; _score: number; fields: Record<string, string> }) => ({
                id: hit._id,
                title: hit.fields?.title || hit._id,
                content: hit.fields?.content || '',
                category: hit.fields?.category || 'unknown',
                type: hit.fields?.type || 'doc',
                score: Math.round(hit._score * 100),
            })
        );

        return NextResponse.json({ results });
    } catch (error) {
        console.error('AI docs search error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
