import { Command } from 'commander';
import { getHelixClient, getAllMems } from '../db/client.js';

export const realityCheckCommand = new Command('reality-check')
  .description('Ground yourself: current time and rules')
  .action(async () => {
    const now = new Date();

    // Format date components in UTC
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
    const month = now.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
    const day = now.getUTCDate();
    const year = now.getUTCFullYear();
    const time = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    });

    const dateStr = `${dayOfWeek}, ${month} ${day}, ${year}`;
    const timeStr = `${time} UTC`;

    // Calculate box width based on content (2 spaces padding each side)
    const maxLen = Math.max(dateStr.length, timeStr.length);
    const innerWidth = maxLen + 4; // 2 spaces padding on each side
    const pad = (str: string) => ('  ' + str).padEnd(innerWidth);

    // Print date/time box
    console.log();
    console.log('╭' + '─'.repeat(innerWidth) + '╮');
    console.log('│' + pad(dateStr) + '│');
    console.log('│' + pad(timeStr) + '│');
    console.log('╰' + '─'.repeat(innerWidth) + '╯');
    console.log();

    // Fetch rules (get all mems and filter - getMemsByType has single-result bug)
    try {
      const client = getHelixClient();
      const allMems = await getAllMems(client);
      const activeRules = allMems.filter(m => m.mem_type === 'Rule' && m.status === 'ACTIVE');

      if (activeRules.length === 0) {
        console.log('RULES: (none)');
      } else {
        console.log('RULES:');
        activeRules.forEach((rule, i) => {
          console.log(`${i + 1}. ${rule.statement}`);
        });
      }
      console.log();
    } catch (error) {
      console.log('RULES: (unable to fetch)');
      console.log();
    }
  });
