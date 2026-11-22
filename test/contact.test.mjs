import test from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../api/contact.js';

const valid = {
  name:'Test Person', businessName:'Test Co', email:'test@example.com',
  phone:'', website:'https://example.com', industry:'Retail', service:'Not sure yet',
  message:'We want to improve our digital marketing and customer inquiries.',
  goal:'Get more qualified inquiries.'
};
const request = data => new Request('http://localhost/api/contact',{
  method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(data)
});

test('rejects invalid input without calling the delivery provider', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw Error('Should not call provider'); };
  try {
    const response = await POST(request({...valid,email:'invalid',website:'javascript:alert(1)'}));
    assert.equal(response.status,400);
    assert.equal((await response.json()).success,false);
  } finally { globalThis.fetch = original; }
});

test('forwards a validated inquiry and reports provider success', async () => {
  const original = globalThis.fetch;
  let sent;
  globalThis.fetch = async (url,options) => { sent={url,body:JSON.parse(options.body)}; return Response.json({success:'true'}); };
  try {
    const response = await POST(request(valid));
    assert.equal(response.status,200);
    assert.equal((await response.json()).success,true);
    assert.match(sent.url,/formsubmit\.co\/ajax\//);
    assert.equal(sent.body.email,valid.email);
    assert.equal(sent.body.goal,valid.goal);
  } finally { globalThis.fetch = original; }
});

test('passes the page origin to FormSubmit for local preview submissions', async () => {
  const original = globalThis.fetch;
  let sent;
  globalThis.fetch = async (_url,options) => {
    sent = options;
    return Response.json({success:'true'});
  };
  try {
    const page = 'http://localhost:4173/book-consultation/';
    const response = await POST(new Request('http://localhost:4173/api/contact',{
      method:'POST',
      headers:{'content-type':'application/json',referer:page,origin:'http://localhost:4173'},
      body:JSON.stringify({...valid,kind:'consultation'})
    }));
    assert.equal(response.status,200);
    assert.equal(sent.headers.Referer,page);
    assert.equal(sent.headers.Origin,'http://localhost:4173');
    assert.equal(JSON.parse(sent.body)._url,page);
  } finally { globalThis.fetch = original; }
});

test('does not show success when delivery fails', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => Response.json({success:false,message:'Not active'});
  try {
    const response = await POST(request(valid));
    assert.equal(response.status,502);
    assert.equal((await response.json()).success,false);
  } finally { globalThis.fetch = original; }
});

test('accepts a consultation request with only the requested fields', async () => {
  const original = globalThis.fetch;
  let subject;
  globalThis.fetch = async (_url,options) => {
    subject = JSON.parse(options.body)._subject;
    return Response.json({success:true});
  };
  try {
    const response = await POST(request({
      kind:'consultation',name:'Test Person',businessName:'Test Co',
      email:'test@example.com',phone:'',website:'https://instagram.com/testco',
      message:'Our biggest challenge is reaching local customers online.'
    }));
    assert.equal(response.status,200);
    assert.equal((await response.json()).success,true);
    assert.match(subject,/consultation request/);
  } finally { globalThis.fetch = original; }
});

test('rejects a short consultation challenge', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw Error('Should not call provider'); };
  try {
    const response = await POST(request({
      kind:'consultation',name:'Test Person',businessName:'Test Co',
      email:'test@example.com',message:'More leads'
    }));
    assert.equal(response.status,400);
  } finally { globalThis.fetch = original; }
});
