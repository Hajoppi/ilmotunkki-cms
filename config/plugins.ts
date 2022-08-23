export default ({ env }) => ({
  migrations: {
    enabled: true,
    config: {
      autoStart: false,
      migrationFolderPath: "./dist/migrations",
    },
  },
  "config-sync": {
    excludedConfig: [
      "core-store.plugin_users-permissions_grant",
      "core-store.plugin_migrations_version",
    ],
  },
});