# preskok-ui

Thin CLI wrapper around shadcn with Preskok registry wiring.

```bash
npx preskok-ui@latest init
npx preskok-ui@latest init button
```

The CLI delegates to `shadcn@latest`. `init` installs the Preskok base for new projects, only registers the Preskok namespace in projects that already have `components.json`, and can add optional components in one pass. `add` resolves bare component names through the Preskok registry.

```bash
npx preskok-ui@latest registry
npx preskok-ui@latest view button
npx preskok-ui@latest diff button
```
