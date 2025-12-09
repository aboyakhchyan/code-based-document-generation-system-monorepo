# Template Seeder

This seeder imports document templates from the frontend and saves them to the database.

## Usage

1. Copy the `CV_TEMPLATES` array from `apps/front/src/constants/document-template.ts`
2. Paste it into the `CV_TEMPLATES` constant in `templates.ts` (replace the empty array)
3. Run the seeder:

```bash
npx ts-node prisma/seeders/templates.ts
```

Or integrate it into your main seed script.

## Structure

- `DocumentTemplate` - stores template metadata (title, styles, dimension)
- `Block` - stores all blocks (content, image, shape) with `templateId` reference

Each block type is stored with:

- `blockType`: "content" | "image" | "shape"
- `metadata`: All block properties (position, size, content, etc.)
- `styles`: Visual styles (colors, fonts, etc.)
