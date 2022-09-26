export default ({ env }) => ({
  migrations: {
    enabled: true,
    config: {
      autoStart: false,
      migrationFolderPath: "./dist/migrations",
    },
  },
  "config-sync": {
    enabled: true,
    config: {
      excludedConfig: [
        "core-store.plugin_users-permissions_grant",
        "core-store.plugin_migrations_version",
        "core-store.plugin_upload_metrics"
      ],
    },
  },
  'management': {
    enabled: true,
    resolve: './src/plugins/management'
  },
});