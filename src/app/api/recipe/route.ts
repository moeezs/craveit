import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://recipes-api-production-6853.up.railway.app';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate that it's an AllRecipes URL
    if (!url.includes('allrecipes.com')) {
      return NextResponse.json(
        { error: 'Please provide a valid AllRecipes.com URL' },
        { status: 400 }
      );
    }

    console.log('Fetching recipe from:', `${API_BASE_URL}/api?url=${encodeURIComponent(url)}`);

    const response = await fetch(`${API_BASE_URL}/api?url=${encodeURIComponent(url)}`, {
      headers: {
        'User-Agent': 'CraveIt-Recipe-App/1.0',
      },
    });

    if (!response.ok) {
      console.error('API Response not OK:', response.status, response.statusText);
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait a moment before trying again.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to fetch recipe: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Recipe data received:', data);

    // Validate response has required fields
    if (!data.title || !data.ingredients || !data.steps) {
      return NextResponse.json(
        { error: 'Invalid recipe data received from external API' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the recipe' },
      { status: 500 }
    );
  }
}
