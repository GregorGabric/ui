# preskok-ui

Thin CLI wrapper around shadcn with Preskok registry wiring.

```bash
npx preskok-ui@latest init button
```

The CLI delegates to `shadcn@latest`. `init` installs the Preskok base and optional components in one pass, and `add` resolves bare component names through the Preskok registry.

```bash
npx preskok-ui@latest registry
npx preskok-ui@latest view button
npx preskok-ui@latest diff button
```
