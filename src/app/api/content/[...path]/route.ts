import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// API route to serve course content files
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params (Next.js 15+ requirement)
    const { path: pathArray } = await params;
    
    // Get the file path from the params
    const filePath = pathArray.join('/');
    
    // Construct the absolute path to the content
    // Course content is now in the app directory: coody-platform/python-sql-finance/
    const contentPath = path.join(process.cwd(), filePath);
    
    console.log('Attempting to load file:', contentPath);
    
    // Read the file
    const content = await fs.readFile(contentPath, 'utf-8');
    
    // Determine content type
    if (filePath.endsWith('.md')) {
      return new NextResponse(content, {
        headers: { 
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } else if (filePath.endsWith('.ipynb')) {
      return NextResponse.json(JSON.parse(content), {
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
    
    return new NextResponse(content, {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    const { path: pathArray } = await params;
    console.error('Error loading content:', error);
    console.error('Attempted path:', path.join(process.cwd(), pathArray.join('/')));
    return NextResponse.json(
      { 
        error: 'Content not found',
        details: error instanceof Error ? error.message : 'Unknown error',
        requestedPath: pathArray.join('/'),
      },
      { status: 404 }
    );
  }
}
