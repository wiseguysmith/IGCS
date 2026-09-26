import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { test, before, after } from 'node:test';
const origin = 'http://127.0.0.1:3101';
let server;
before(async () => {
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3101'], {
    env: { ...process.env, SUPABASE_URL: '', SUPABASE_SERVICE_ROLE_KEY: '' }, stdio: 'pipe',
  });
  let output = '';
  server.stdout.on('data', d => { output += d; });
  server.stderr.on('data', d => { output += d; });
  for (let attempt = 0; attempt < 80; attempt++) {
    if (server.exitCode !== null) throw new Error(output);
    if (output.includes('Ready in')) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Production test server did not start: ' + output);
});
after(() => { server?.kill(); });
const fields = { firstName:'Test', lastName:'Applicant', company:'Test company', title:'Founder', email:'igcs-test@example.invalid', phone:'5550100', location:'San Antonio', category:'Investor' };
function submit(path, data, requestOrigin=origin) {
  return fetch(origin + path, {method:'POST',headers:{'Content-Type':'application/json',Origin:requestOrigin},body:JSON.stringify(data)});
}
test('homepage renders both named application forms and security headers', async () => {
  const r=await fetch(origin);assert.equal(r.status,200);
  assert.equal(r.headers.get('x-content-type-options'),'nosniff');
  assert.match(r.headers.get('content-security-policy'),/frame-ancestors 'self'/);
  const html=await r.text();assert.match(html,/Invitation application/);assert.match(html,/Partnership inquiry/);
});
test('admin is noindex and unauthenticated data cannot be cached', async () => {
  const page=await fetch(origin+'/admin');assert.match(page.headers.get('x-robots-tag'),/noindex/);
  assert.match(await page.text(),/noindex, nofollow/);
  const r=await fetch(origin+'/api/admin');assert.equal(r.status,401);assert.match(r.headers.get('cache-control'),/no-store/);
});
test('cross-origin submissions are rejected', async()=>{assert.equal((await submit('/api/leads',{kind:'invitation',fields},'https://example.invalid')).status,403)});
test('unexpected attendee category is rejected', async()=>{const r=await submit('/api/leads',{kind:'invitation',fields:{...fields,category:'unexpected'}});assert.equal(r.status,400);assert.match((await r.json()).error,/professional role/)});
test('malformed and credential-bearing URLs are rejected', async()=>{
  for(const linkedin of ['https://','javascript:alert(1)','https://user:password@example.com']){
    const r=await submit('/api/leads',{kind:'invitation',fields:{...fields,linkedin}});assert.equal(r.status,400);assert.match((await r.json()).error,/website URL/);
  }
});
test('oversized submission is rejected before processing', async()=>{assert.equal((await submit('/api/leads',{kind:'invitation',fields,padding:'x'.repeat(21000)})).status,413)});
test('unconnected database never reports successful lead capture', async()=>{const r=await submit('/api/leads',{kind:'invitation',fields});assert.equal(r.status,503);const body=await r.json();assert.equal(body.ok,undefined);assert.match(body.error,/not open/)});
test('malformed admin login receives actionable error', async()=>{const r=await submit('/api/admin',{action:'login',email:123,password:null});assert.equal(r.status,400);assert.match((await r.json()).error,/email and password/)});
test('unapproved policy remains clearly labeled',async()=>{const r=await fetch(origin+'/legal/privacy');assert.equal(r.status,200);assert.match(await r.text(),/has not yet been approved/)});
