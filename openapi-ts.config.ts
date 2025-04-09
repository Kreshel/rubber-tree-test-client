import { defineConfig, defaultPlugins } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://localhost:7153/swagger/v1/swagger.json',
  output: '@/client',
  name: 'rubber-tree-test-api',
  plugins: [
    ...defaultPlugins,
    '@hey-api/client-fetch',
    '@tanstack/react-query',
  ],
});
