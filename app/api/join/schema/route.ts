import { NextResponse } from 'next/server';
import { fetchNotionJoinSchema, JOIN_REQUIRED_FIELDS, type JoinFieldKey } from '@/lib/notion-schema';

const FIELD_ORDER: JoinFieldKey[] = [
  'name',
  'email',
  'whatsapp',
  'country',
  'role',
  'experienceLevel',
  'whatBuilding',
  'interests',
];

export async function GET() {
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;
  const notionApiKey = process.env.NOTION_API_KEY;

  if (!notionDatabaseId || !notionApiKey) {
    return NextResponse.json(
      { error: 'Missing Notion environment variables' },
      { status: 500 }
    );
  }

  try {
    const schema = await fetchNotionJoinSchema(notionApiKey, notionDatabaseId);
    const fields = FIELD_ORDER
      .map((fieldKey) => {
        const property = schema.fields[fieldKey];
        if (!property) {
          return null;
        }

        return {
          key: fieldKey,
          propertyName: property.name,
          propertyType: property.type,
          required: JOIN_REQUIRED_FIELDS.includes(fieldKey),
          options: property.options ?? [],
        };
      })
      .filter((field): field is NonNullable<typeof field> => Boolean(field));

    return NextResponse.json({ fields }, { status: 200 });
  } catch (error) {
    console.error('Join schema API error:', error);
    return NextResponse.json(
      { error: 'Failed to load schema' },
      { status: 500 }
    );
  }
}
