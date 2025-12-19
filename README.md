# Client-Side Quiz

A static quiz engine where flow definitions live entirely in TypeScript.

**Live demo:** https://dylan-euc.github.io/client-side-quiz/

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Local Development with Database

For persistence during local development:

```bash
# Start PostgreSQL + dev server
./scripts/start.sh

# Or manually:
docker-compose up -d
npm run dev
```

## Deploy to GitHub Pages

```bash
npm run build
# Output is in /out - deploy this folder
```

## Project Structure

```
app/
  flows/[flowId]/           # Flow details & visualizer
  question-types/[type]/    # Question type previews
  quiz/[flowId]/            # Quiz preview mode
lib/flows/
  definitions/              # Flow definitions (source of truth)
  engine/                   # useFlow hook, types, validation
  question-types/           # Question type components
  components/               # Shared UI components
```

## Adding a Flow

1. Create a new file in `lib/flows/definitions/`
2. Use `defineFlow()` for type safety and validation
3. Register it in `lib/flows/definitions/index.ts`

```typescript
import { defineFlow } from '../engine/types';

export const myFlow = defineFlow({
  id: 'my-flow',
  name: 'My Flow',
  version: '1.0.0',
  initialStep: 'start',
  steps: [...],
  outcomes: {...},
});
```

## License

MIT
