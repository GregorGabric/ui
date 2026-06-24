export const siteConfig = {
  name: "preskok/ui",
  url: "ui-three-mu.vercel.app",
  ogImage: "ui-three-mu.vercel.app/og.jpg",
  description: "A set of well-designed, accessible react-aria components",
  links: {
    github: "https://github.com/GregorGabric/ui",
    npm: "https://www.npmjs.com/package/preskok-ui",
    registry: "/r/index.json",
  },
  package: {
    installCommand: "npx preskok-ui@latest init",
    name: "preskok-ui",
    version: "0.0.6",
  },
  navItems: [
    {
      href: "/installation",
      label: "Docs / Components",
    },
    {
      href: "/theme",
      label: "Theme",
    },
  ],
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}
