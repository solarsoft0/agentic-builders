import { NextRequest, NextResponse } from 'next/server';
import {
  buildJoinPayloadProperties,
  fetchNotionJoinSchema,
  JOIN_REQUIRED_FIELDS,
  type JoinFieldKey,
} from '@/lib/notion-schema';

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

    const schema = await fetchNotionJoinSchema(notionApiKey, notionDatabaseId);

    const requiredErrors: string[] = [];
    for (const field of JOIN_REQUIRED_FIELDS) {
      if (!schema.fields[field]) {
        continue;
      }

      if (field === 'name' && !body.name) {
        requiredErrors.push('Name is required');
      }
    }

    const conditionallyRequiredFields: Array<{
      field: JoinFieldKey;
      value: string | undefined;
      label: string;
    }> = [
      { field: 'email', value: body.email, label: 'Email is required' },
      { field: 'whatsapp', value: body.whatsapp, label: 'WhatsApp number is required' },
    ];

    for (const item of conditionallyRequiredFields) {
      if (schema.fields[item.field] && !item.value) {
        requiredErrors.push(item.label);
      }
    }

    if (requiredErrors.length > 0) {
      return NextResponse.json(
        { error: requiredErrors.join('. ') },
        { status: 400 }
      );
    }

    const properties = buildJoinPayloadProperties(schema, {
      name: body.name,
      email: body.email,
      whatsapp: body.whatsapp,
      country: body.country,
      role: body.role,
      interests: body.interests,
      experienceLevel: body.experienceLevel,
      whatBuilding: body.whatBuilding,
    });

    if (Object.keys(properties).length === 0) {
      return NextResponse.json(
        { error: 'No compatible fields found in Notion database' },
        { status: 500 }
      );
    }

    // Create the page in Notion
    const createPageResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2025-09-03',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: {
          [schema.parent.type]: schema.parent.id
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
