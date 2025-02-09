import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.sync
const envPath = path.resolve(process.cwd(), '.env.sync');
console.log('Loading environment from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  throw new Error(`Error loading .env.sync file: ${result.error.message}`);
}

// Debug: Print loaded environment variables (without sensitive data)
console.log('Environment variables loaded:', {
  LOCAL_STRAPI_URL: process.env.LOCAL_STRAPI_URL,
  PROD_STRAPI_URL: process.env.PROD_STRAPI_URL,
  LOCAL_TRANSFER_TOKEN: process.env.LOCAL_TRANSFER_TOKEN
    ? '[SET]'
    : '[NOT SET]',
  PROD_TRANSFER_TOKEN: process.env.PROD_TRANSFER_TOKEN ? '[SET]' : '[NOT SET]',
});

interface SyncOptions {
  direction: 'push' | 'pull';
  includeFiles?: boolean;
  includeDrafts?: boolean;
}

class StrapiSync {
  private readonly localUrl: string;
  private readonly prodUrl: string;
  private readonly localToken: string;
  private readonly prodToken: string;
  private readonly backupDir: string;

  constructor() {
    // Validate required environment variables and their formats
    const requiredEnvVars = {
      LOCAL_STRAPI_URL: /^https?:\/\/.+/,
      PROD_STRAPI_URL: /^https?:\/\/.+/,
      LOCAL_TRANSFER_TOKEN: /.+/,
      PROD_TRANSFER_TOKEN: /.+/,
    };

    for (const [envVar, pattern] of Object.entries(requiredEnvVars)) {
      const value = process.env[envVar];
      if (!value) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
      if (!pattern.test(value)) {
        throw new Error(`Invalid format for ${envVar}`);
      }
    }

    this.localUrl = process.env.LOCAL_STRAPI_URL!;
    this.prodUrl = process.env.PROD_STRAPI_URL!;
    this.localToken = process.env.LOCAL_TRANSFER_TOKEN!;
    this.prodToken = process.env.PROD_TRANSFER_TOKEN!;
    this.backupDir = path.join(__dirname, '../backups');

    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  private async createBackup(environment: 'local' | 'prod'): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(
      this.backupDir,
      `${environment}-backup-${timestamp}.tar.gz`
    );

    const url = environment === 'local' ? this.localUrl : this.prodUrl;
    const token = environment === 'local' ? this.localToken : this.prodToken;

    console.log(`Creating backup for ${environment} environment...`);

    try {
      // Create backup using Strapi v5 syntax
      execSync(
        `npx @strapi/strapi export --no-encrypt --file "${backupFile}"`,
        {
          stdio: 'inherit',
          env: {
            ...process.env,
            STRAPI_ADMIN_URL: url,
            STRAPI_TRANSFER_TOKEN: token,
          },
        }
      );
      return backupFile;
    } catch (error) {
      throw new Error(`Backup creation failed for ${environment}: ${error}`);
    }
  }

  async sync({
    direction,
    includeFiles = true,
    includeDrafts = false,
  }: SyncOptions): Promise<void> {
    try {
      // Create backup before sync
      const sourceEnv = direction === 'push' ? 'local' : 'prod';
      const targetEnv = direction === 'push' ? 'prod' : 'local';

      console.log(
        `Starting ${direction} sync from ${sourceEnv} to ${targetEnv}...`
      );

      // Create backup of target environment
      const backupFile = await this.createBackup(targetEnv);
      console.log(`Backup created: ${backupFile}`);

      // Prepare source and target URLs and tokens
      const sourceUrl = direction === 'push' ? this.localUrl : this.prodUrl;
      const targetUrl = direction === 'push' ? this.prodUrl : this.localUrl;
      const sourceToken =
        direction === 'push' ? this.localToken : this.prodToken;
      const targetToken =
        direction === 'push' ? this.prodToken : this.localToken;

      // Step 1: Export from source
      const exportFileName = `temp-export-${Date.now()}`;
      const tempExportFile = path.join(this.backupDir, exportFileName);

      console.log('Exporting data from source...');
      execSync(
        `npx @strapi/strapi export --no-encrypt --file "${tempExportFile}"`,
        {
          stdio: 'inherit',
          env: {
            ...process.env,
            STRAPI_ADMIN_URL: sourceUrl,
            STRAPI_TRANSFER_TOKEN: sourceToken,
          },
        }
      );

      // The actual exported file will have .tar.gz.tar.gz extension
      const actualExportFile = `${tempExportFile}.tar.gz.tar.gz`;
      const correctedExportFile = `${tempExportFile}.tar.gz`;

      // Rename the file to have correct extension
      if (fs.existsSync(actualExportFile)) {
        fs.renameSync(actualExportFile, correctedExportFile);
      }

      // Step 2: Import to target
      console.log('Importing data to target...');
      execSync(
        `npx @strapi/strapi import --file "${correctedExportFile}" --force`,
        {
          stdio: 'inherit',
          env: {
            ...process.env,
            STRAPI_ADMIN_URL: targetUrl,
            STRAPI_TRANSFER_TOKEN: targetToken,
          },
        }
      );

      // Clean up temp files
      if (fs.existsSync(correctedExportFile)) {
        fs.unlinkSync(correctedExportFile);
      }
      if (fs.existsSync(actualExportFile)) {
        fs.unlinkSync(actualExportFile);
      }

      console.log('Sync completed successfully!');
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const direction = args[0] as 'push' | 'pull';

  if (!direction || !['push', 'pull'].includes(direction)) {
    console.error(
      'Usage: ts-node scripts/sync.ts <push|pull> [--include-files] [--include-drafts]'
    );
    process.exit(1);
  }

  const includeFiles = args.includes('--include-files');
  const includeDrafts = args.includes('--include-drafts');

  const syncer = new StrapiSync();

  try {
    await syncer.sync({ direction, includeFiles, includeDrafts });
  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default StrapiSync;
