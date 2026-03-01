import { NextRequest, NextResponse } from 'next/server';

interface JoinRequest {
  name: string;
  email: string;
  whatsapp: string;
  country?: string;
  role?: string;
  interests?: string[];
  experienceLevel?: string;
  whatBuilding?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: JoinRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.whatsapp) {
      return NextResponse.json(
        { error: 'Name, email, and WhatsApp number are required' },
        { status: 400 }
      );
    }

    // Get the Notion database ID and API key from environment variables
    const notionDatabaseId = process.env.NOTION_DATABASE_ID;
    const notionApiKey = process.env.NOTION_API_KEY;

    if (!notionDatabaseId || !notionApiKey) {
      console.error('Missing Notion environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Prepare the Notion page properties
    const properties: Record<string, any> = {
      'Name': {
        title: [{ text: { content: body.name } }]
      },
      'Email': {
        email: body.email
      },
      'WhatsApp': {
        phone_number: body.whatsapp
      }
    };

    // Add optional fields if provided
    if (body.country) {
      properties['Country'] = {
        rich_text: [{ text: { content: body.country } }]
      };
    }

    if (body.role) {
      properties['Role'] = {
        rich_text: [{ text: { content: body.role } }]
      };
    }

    if (body.experienceLevel) {
      properties['Experience Level'] = {
        select: { name: body.experienceLevel }
      };
    }

    if (body.whatBuilding) {
      properties['What Building On'] = {
        rich_text: [{ text: { content: body.whatBuilding } }]
      };
    }

    if (body.interests && body.interests.length > 0) {
      properties['Interests'] = {
        multi_select: body.interests.map(interest => ({ name: interest }))
      };
    }

    // Add joined date
    properties['Joined At'] = {
      date: {
        start: new Date().toISOString().split('T')[0]
      }
    };

    // Create the page in Notion
    const createPageResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2024-05-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: {
          database_id: notionDatabaseId.replace(/-/g, '')
        },
        properties
      })
    });

    if (!createPageResponse.ok) {
      const errorData = await createPageResponse.json();
      console.error('Notion API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to save to database' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Successfully joined the community!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Join API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
