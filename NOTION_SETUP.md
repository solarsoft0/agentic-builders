# Notion Integration Setup

This guide explains how to set up the Notion database connection for the community registration feature.

## Step 1: Create a Notion Database

1. Go to [Notion](https://notion.so)
2. Create a new database with the following columns:
   - **Name** (Title) - Member name
   - **Email** (Email) - Member email address
   - **WhatsApp** (Phone Number) - WhatsApp contact number
   - **Country** (Text) - Country/location in Africa
   - **Role** (Text) - Current role or title
   - **Experience Level** (Select) - Options: Beginner, Intermediate, Advanced, Expert
   - **Interests** (Multi-select) - Options: AI & Machine Learning, Robotics, FinTech, HealthTech, Agriculture, Climate Tech, Education, Energy, Other
   - **What Building On** (Text/Rich text) - Description of current project
   - **Joined At** (Date) - Automatic timestamp

## Step 2: Get Notion API Credentials

1. Go to [Notion Developers](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Fill in:
   - **Name**: "Agentic Builders"
   - **Associated workspace**: Select your workspace
4. Copy the **Internal Integration Token** (starts with `secret_`)

## Step 3: Share Database with Integration

1. Open your Notion database
2. Click the **Share** button (top right)
3. Find your integration in the "Invite" section or paste the integration link
4. Grant it **Editor** access

## Step 4: Get Database ID

1. Open your database in Notion
2. Copy the database ID from the URL:
   - URL format: `https://notion.so/your-workspace/{DATABASE_ID}?v=...`
   - The ID is the long string before the `?`

## Step 5: Set Environment Variables

Add these environment variables to your `.env.local` file:

```
NOTION_API_KEY=secret_your_integration_token_here
NOTION_DATABASE_ID=your_database_id_here
```

For Vercel deployment:
1. Go to your Vercel project settings
2. Navigate to **Settings > Environment Variables**
3. Add the two variables above

## How It Works

When a user submits the form:
1. The form loads `/api/join/schema` to introspect the connected Notion database.
2. The UI automatically shows only supported fields and uses Notion select/multi-select options.
3. Form data is sent to `/api/join` endpoint.
4. The endpoint re-introspects the schema and maps values by property type/name before creating the page.
5. User sees success message and gets access to the community link.

## Community Link

After successful registration, users are shown a link to join the community:
- **https://dub.sh/agenticbuilders**

Make sure this link is active and ready before launching!
