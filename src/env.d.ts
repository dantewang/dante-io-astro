declare module 'virtual:site-config' {
  const config: import('./integrations/site-config.mjs').SiteConfig;
  export default config;
}
