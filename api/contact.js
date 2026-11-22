const MAX_BYTES = 12000;
const services = new Set([
  'Not sure yet',
  'AI Marketing Strategy',
  'Social Media Marketing',
  'Search Engine Optimization',
  'Paid Advertising',
  'Content Marketing & AI Content Creation',
  'Marketing Automation & AI Integration',
  'Website & Landing Page Optimization'
]);
const json = (data,status=200) => Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const clean = (value,max) => typeof value === 'string' ? value.trim().slice(0,max+1) : '';
const emailValid = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request) {
  if (Number(request.headers.get('content-length') || 0) > MAX_BYTES) return json({success:false,message:'The message is too long.'},413);
  let data;
  try {
    if (!(request.headers.get('content-type') || '').includes('application/json')) return json({success:false,message:'Expected JSON.'},415);
    const raw = await request.text();
    if (raw.length > MAX_BYTES) return json({success:false,message:'The message is too long.'},413);
    data = JSON.parse(raw);
  } catch { return json({success:false,message:'Invalid message data.'},400); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return json({success:false,message:'Invalid message data.'},400);
  if (clean(data._honey,100)) return json({success:true});
  if (data.kind && data.kind !== 'consultation') return json({success:false,message:'Invalid inquiry type.'},400);
  const consultation = data.kind === 'consultation';
  const inquiry = {
    kind:consultation ? 'consultation' : 'contact',
    name:clean(data.name,100),
    businessName:clean(data.businessName,150),
    email:clean(data.email,254),
    phone:clean(data.phone,40),
    website:clean(data.website,500),
    industry:clean(data.industry,100),
    service:clean(data.service,100),
    message:clean(data.message,3000),
    goal:clean(data.goal,2000)
  };
  const commonInvalid = !inquiry.name || inquiry.name.length > 100 || !inquiry.businessName || inquiry.businessName.length > 150 || !emailValid(inquiry.email) || inquiry.email.length > 254 || inquiry.message.length < 20 || inquiry.message.length > 3000 || inquiry.phone.length > 40 || inquiry.website.length > 500;
  const contactInvalid = !consultation && (!inquiry.industry || inquiry.industry.length > 100 || !services.has(inquiry.service) || inquiry.goal.length < 10 || inquiry.goal.length > 2000);
  if (commonInvalid || contactInvalid) return json({success:false,message:'Please check the required fields and try again.'},400);
  if (inquiry.website) {
    try { if (!['http:','https:'].includes(new URL(inquiry.website).protocol)) throw Error(); }
    catch { return json({success:false,message:'Enter a valid website URL.'},400); }
  }
  const destination = process.env.CONTACT_EMAIL || 'arunthapaa962@gmail.com';
  if (!emailValid(destination)) return json({success:false,message:'Contact delivery is not configured.'},503);
  try {
    const referer = request.headers.get('referer');
    const origin = request.headers.get('origin');
    const providerHeaders = {'Content-Type':'application/json','Accept':'application/json'};
    if (referer && /^https?:\/\//i.test(referer)) providerHeaders.Referer = referer;
    if (origin && /^https?:\/\//i.test(origin)) providerHeaders.Origin = origin;
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(destination)}`,{
      method:'POST',
      headers:providerHeaders,
      body:JSON.stringify({...inquiry,_subject:consultation?'New DIGITAL ARUN consultation request':'New DIGITAL ARUN website inquiry',_template:'table',_replyto:inquiry.email,_url:referer || data._url || ''})
    });
    if (!response.ok) return json({success:false,message:'The message service is unavailable. Please email us directly.'},502);
    const result = await response.json();
    if (result.success === false || result.success === 'false') return json({success:false,message:'The message service declined the inquiry. Please email us directly.'},502);
    return json({success:true});
  } catch { return json({success:false,message:'The message could not be delivered. Please email us directly.'},502); }
}

export function GET() { return json({success:false,message:'Use the contact form to send a message.'},405); }
