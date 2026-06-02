import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',
    
    // Test files patterns
    include: [
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ],

    // Test timeout
    testTimeout: 30000,
    hookTimeout: 30000,
    
    // Keep local test output readable. CI-specific reports can be enabled from CI commands.
    reporters: ['default'],

    // Coverage is disabled for `npm test` and enabled explicitly with
    // `npm run test:coverage` / `vitest run --coverage`.
    coverage: {
      enabled: false,
      provider: 'v8',
      reporter: [
        'text',
        'text-summary',
        'html',
        'lcov',
        'json',
        'json-summary',
        'cobertura',
        'clover'
      ],
      
      // Coverage output
      reportsDirectory: './coverage',
      
      // Coverage thresholds
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 50,
        statements: 50
      },
      
      // Include/exclude patterns
      include: [
        'src/**/*.{js,ts}'
      ],
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/index.{js,ts}',
        '**/*.interface.{js,ts}',
        '**/*.type.{js,ts}',
        '**/*.enum.{js,ts}',
        '**/*.constant.{js,ts}'
      ],
      
      // Skip coverage for files with no tests
      skipFull: false,
      
      // Clean coverage directory before running tests
      clean: true,
      
      // All files coverage
      all: true
    },

    // Watch mode
    watch: false,
    
    // Parallel execution
    pool: 'threads',
    maxWorkers: 4,
    minWorkers: 1,
    
    // Retry failed tests
    retry: 2,
    
    // Bail on first failure in CI
    bail: process.env.CI ? 1 : 0,
    
    // Silent mode
    silent: false,
    
    // UI configuration
    ui: false,
    open: false,
    
    // Mock configuration
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    
    // Snapshot configuration
    resolveSnapshotPath: (testPath: string, snapExtension: string) => {
      return resolve(testPath.replace(/\.test\./, '.snap.') + snapExtension);
    },
    
    // Setup files
    setupFiles: ['./tests/setup.ts'],
    
    // Global variables
    globals: true,
    
    // TypeScript checks are handled by `npm run type-check`.
    typecheck: {
      enabled: false,
      tsconfig: './tsconfig.json'
    },
    
    // Performance monitoring
    logHeapUsage: false,
    
    // Test isolation
    isolate: true,
    
    // Sequence configuration
    sequence: {
      shuffle: false,
      concurrent: true,
      setupFiles: 'parallel',
      hooks: 'stack'
    },
    
    // Benchmark configuration
    benchmark: {
      outputFile: './coverage/benchmark.json',
      reporters: ['default', 'json']
    }
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tests': resolve(__dirname, './tests'),
      '@domain': resolve(__dirname, './src/domain'),
      '@application': resolve(__dirname, './src/application'),
      '@infrastructure': resolve(__dirname, './src/infrastructure'),
      '@presentation': resolve(__dirname, './src/presentation')
    }
  },
  
  // Define configuration
  define: {
    __TEST__: true,
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production'
  }
});
