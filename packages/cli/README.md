# preskok-ui

Thin CLI wrapper around shadcn with Preskok registry wiring.

```bash
npx preskok-ui@latest init
npx preskok-ui@latest init button
```

The CLI delegates to `shadcn@4.9.0` by default. Set `PRESKOK_SHADCN_VERSION` to test another shadcn CLI version. Use `init` for new projects, `registry` for existing shadcn projects, and `add` to resolve bare component names through the Preskok registry.

```bash
npx preskok-ui@latest registry
npx preskok-ui@latest view button
npx preskok-ui@latest diff button
```
