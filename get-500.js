const http = require('http');

async function test() {
  // First, we need to create a test user via API or we can just hit a route that doesn't need auth?
  // /mock-interview/[sessionId] needs auth. It redirects to /mock-interview if error.
  // Wait, if it redirects to /mock-interview if error, then it DOES NOT 500!
  
  // What if we don't have auth?
  // Let's check what happens if we curl /mock-interview/123
  console.log("Fetching /mock-interview/123...");
  const res = await fetch('http://localhost:3000/mock-interview/123');
  console.log(res.status, res.statusText);
  const text = await res.text();
  console.log(text.slice(0, 200));
}

test();
