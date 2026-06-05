# preskok-ui

Thin CLI wrapper around shadcn with Preskok registry wiring.

```bash
npx preskok-ui@latest init
npx preskok-ui@latest add button
```

The CLI delegates to `shadcn@latest`. `init` registers Preskok after shadcn setup, and `add` resolves bare component names through the Preskok registry.

```bash
npx preskok-ui@latest registry
npx preskok-ui@latest diff
```
