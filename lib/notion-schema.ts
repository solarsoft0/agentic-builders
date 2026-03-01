export type JoinFieldKey =
  | 'name'
  | 'email'
  | 'whatsapp'
  | 'country'
  | 'role'
  | 'experienceLevel'
  | 'whatBuilding'
  | 'interests'
  | 'joinedAt';

type NotionPropertyType =
  | 'title'
  | 'rich_text'
  | 'email'
  | 'phone_number'
  | 'select'
  | 'multi_select'
  | 'date';

interface NotionDatabaseResponse {
  properties?: Record<string, NotionDatabasePropertyApi>;
  data_sources?: Array<{
    id: string;
    name: string;
  }>;
}

interface NotionDataSourceResponse {
  properties: Record<string, NotionDatabasePropertyApi>;
}

interface NotionSelectOption {
  name: string;
}

interface NotionDatabasePropertyApi {
  id: string;
  type: string;
  select?: {
    options: NotionSelectOption[];
  };
  multi_select?: {
    options: NotionSelectOption[];
  };
}

export interface ResolvedNotionProperty {
  name: string;
  type: NotionPropertyType;
  options?: string[];
}

export interface JoinSchema {
  parent: {
    type: 'database_id' | 'data_source_id';
    id: string;
  };
  fields: Partial<Record<JoinFieldKey, ResolvedNotionProperty>>;
}

interface JoinFieldDefinition {
  key: JoinFieldKey;
  aliases: string[];
  types: NotionPropertyType[];
  required: boolean;
}

const JOIN_FIELD_DEFINITIONS: JoinFieldDefinition[] = [
  {
    key: 'name',
    aliases: ['name', 'full name', 'member name', 'fullname'],
    types: ['title', 'rich_text'],
    required: true,
  },
  {
    key: 'email',
    aliases: ['email', 'email address'],
    types: ['email', 'rich_text'],
    required: false,
  },
  {
    key: 'whatsapp',
    aliases: ['whatsapp', 'whatsapp number', 'phone', 'phone number'],
    types: ['phone_number', 'rich_text'],
    required: false,
  },
  {
    key: 'country',
    aliases: ['country', 'location'],
    types: ['rich_text', 'select'],
    required: false,
  },
  {
    key: 'role',
    aliases: ['role', 'title', 'role/title', 'job title'],
    types: ['rich_text', 'select'],
    required: false,
  },
  {
    key: 'experienceLevel',
    aliases: ['experience level', 'experience', 'level'],
    types: ['select', 'rich_text'],
    required: false,
  },
  {
    key: 'whatBuilding',
    aliases: ['what building on', 'what are you building on', 'project', 'what building'],
    types: ['rich_text'],
    required: false,
  },
  {
    key: 'interests',
    aliases: ['interests', 'areas of interest'],
    types: ['multi_select', 'rich_text'],
    required: false,
  },
  {
    key: 'joinedAt',
    aliases: ['joined at', 'joined', 'created at', 'date joined'],
    types: ['date'],
    required: false,
  },
];

export const JOIN_REQUIRED_FIELDS = JOIN_FIELD_DEFINITIONS
  .filter((definition) => definition.required)
  .map((definition) => definition.key);

const SUPPORTED_NOTION_TYPES: NotionPropertyType[] = [
  'title',
  'rich_text',
  'email',
  'phone_number',
  'select',
  'multi_select',
  'date',
];

function isSupportedNotionType(type: string): type is NotionPropertyType {
  return SUPPORTED_NOTION_TYPES.includes(type as NotionPropertyType);
}

function normalize(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function createResolvedProperty(
  name: string,
  property: NotionDatabasePropertyApi
): ResolvedNotionProperty | null {
  if (!isSupportedNotionType(property.type)) {
    return null;
  }

  if (property.type === 'select') {
    return {
      name,
      type: property.type,
      options: (property.select?.options ?? []).map((option) => option.name),
    };
  }

  if (property.type === 'multi_select') {
    return {
      name,
      type: property.type,
      options: (property.multi_select?.options ?? []).map((option) => option.name),
    };
  }

  return {
    name,
    type: property.type,
  };
}

function findPropertyByDefinition(
  properties: ResolvedNotionProperty[],
  definition: JoinFieldDefinition
): ResolvedNotionProperty | undefined {
  const aliasSet = new Set(definition.aliases.map(normalize));

  return properties.find((property) => {
    if (!definition.types.includes(property.type)) {
      return false;
    }

    return aliasSet.has(normalize(property.name));
  });
}

export async function fetchNotionJoinSchema(
  notionApiKey: string,
  notionDatabaseId: string
): Promise<JoinSchema> {
  const sanitizedDatabaseId = notionDatabaseId.replace(/-/g, '');

  const response = await fetch(
    `https://api.notion.com/v1/databases/${sanitizedDatabaseId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${notionApiKey}`,
        'Notion-Version': '2025-09-03',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch Notion schema: ${response.status} ${errorBody}`);
  }

  const database = (await response.json()) as NotionDatabaseResponse;

  let schemaSource: Record<string, NotionDatabasePropertyApi> | undefined = database.properties;
  let parent: JoinSchema['parent'] = {
    type: 'database_id',
    id: sanitizedDatabaseId,
  };

  if (!schemaSource || Object.keys(schemaSource).length === 0) {
    const dataSourceId = database.data_sources?.[0]?.id;
    if (!dataSourceId) {
      throw new Error('No Notion data source found for database schema introspection');
    }

    const dataSourceResponse = await fetch(
      `https://api.notion.com/v1/data_sources/${dataSourceId.replace(/-/g, '')}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${notionApiKey}`,
          'Notion-Version': '2025-09-03',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!dataSourceResponse.ok) {
      const errorBody = await dataSourceResponse.text();
      throw new Error(`Failed to fetch Notion data source schema: ${dataSourceResponse.status} ${errorBody}`);
    }

    const dataSource = (await dataSourceResponse.json()) as NotionDataSourceResponse;
    schemaSource = dataSource.properties;
    parent = {
      type: 'data_source_id',
      id: dataSourceId.replace(/-/g, ''),
    };
  }

  const properties = Object.entries(schemaSource)
    .map(([name, property]) => createResolvedProperty(name, property))
    .filter((property): property is ResolvedNotionProperty => Boolean(property));

  const fields: JoinSchema['fields'] = {};

  for (const definition of JOIN_FIELD_DEFINITIONS) {
    const matchedProperty = findPropertyByDefinition(properties, definition);
    if (matchedProperty) {
      fields[definition.key] = matchedProperty;
    }
  }

  if (!fields.name) {
    const titleProperty = properties.find((property) => property.type === 'title');
    if (titleProperty) {
      fields.name = titleProperty;
    }
  }

  return { parent, fields };
}

type NotionPagePropertyValue =
  | { title: Array<{ text: { content: string } }> }
  | { rich_text: Array<{ text: { content: string } }> }
  | { email: string }
  | { phone_number: string }
  | { select: { name: string } }
  | { multi_select: Array<{ name: string }> }
  | { date: { start: string } };

function encodeStringValue(type: NotionPropertyType, value: string): NotionPagePropertyValue | null {
  if (!value.trim()) {
    return null;
  }

  if (type === 'title') {
    return { title: [{ text: { content: value } }] };
  }

  if (type === 'rich_text') {
    return { rich_text: [{ text: { content: value } }] };
  }

  if (type === 'email') {
    return { email: value };
  }

  if (type === 'phone_number') {
    return { phone_number: value };
  }

  if (type === 'select') {
    return { select: { name: value } };
  }

  return null;
}

function encodeStringArrayValue(type: NotionPropertyType, values: string[]): NotionPagePropertyValue | null {
  const filteredValues = values.map((value) => value.trim()).filter(Boolean);
  if (filteredValues.length === 0) {
    return null;
  }

  if (type === 'multi_select') {
    return {
      multi_select: filteredValues.map((value) => ({ name: value })),
    };
  }

  if (type === 'rich_text') {
    return {
      rich_text: [{ text: { content: filteredValues.join(', ') } }],
    };
  }

  return null;
}

export function buildJoinPayloadProperties(
  schema: JoinSchema,
  values: {
    name: string;
    email?: string;
    whatsapp?: string;
    country?: string;
    role?: string;
    interests?: string[];
    experienceLevel?: string;
    whatBuilding?: string;
  }
): Record<string, NotionPagePropertyValue> {
  const properties: Record<string, NotionPagePropertyValue> = {};

  const mapStringField = (field: JoinFieldKey, value?: string) => {
    if (!value) {
      return;
    }

    const notionProperty = schema.fields[field];
    if (!notionProperty) {
      return;
    }

    const encoded = encodeStringValue(notionProperty.type, value);
    if (encoded) {
      properties[notionProperty.name] = encoded;
    }
  };

  mapStringField('name', values.name);
  mapStringField('email', values.email);
  mapStringField('whatsapp', values.whatsapp);
  mapStringField('country', values.country);
  mapStringField('role', values.role);
  mapStringField('experienceLevel', values.experienceLevel);
  mapStringField('whatBuilding', values.whatBuilding);

  if (values.interests && values.interests.length > 0) {
    const notionProperty = schema.fields.interests;
    if (notionProperty) {
      const encoded = encodeStringArrayValue(notionProperty.type, values.interests);
      if (encoded) {
        properties[notionProperty.name] = encoded;
      }
    }
  }

  if (schema.fields.joinedAt?.type === 'date') {
    properties[schema.fields.joinedAt.name] = {
      date: {
        start: new Date().toISOString().split('T')[0],
      },
    };
  }

  return properties;
}
