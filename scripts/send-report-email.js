import { sendDailyReportEmail } from '../src/report-email.js';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

try {
  const result = await sendDailyReportEmail({
    dryRun,
    to: dryRun && !process.env.REPORT_EMAIL_TO ? 'preview@example.com' : undefined,
  });
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
