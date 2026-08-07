const fs = require('fs');
const unzipper = require('unzipper');

async function parse() {
  const directory = await unzipper.Open.file('test-results/mock-interview-performance-e31cc-Interview-creation-takes-3s-chromium/trace.zip');
  for (const file of directory.files) {
    if (file.path.endsWith('.jsonl') || file.path.endsWith('.json') || file.path.endsWith('.txt')) {
       const content = await file.buffer();
       const text = content.toString('utf-8');
       if (text.includes('Failed to generate interview') || text.includes('setupInterviewAction')) {
          console.log(`Found in ${file.path}:`);
          console.log(text.substring(0, 1000));
       }
    }
  }
}
parse().catch(console.error);
