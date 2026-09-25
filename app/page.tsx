"use client";
import { useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type Step = "search" | "manual" | "preview";
type Interaction = "visit-us" | "we-visit" | "delivery" | "online";

const interactionOptions: {id: Interaction; title: string; detail: string}[] = [
  {id:"visit-us", title:"Customers visit us", detail:"Restaurant, salon, retail store, office, clinic, or other location"},
  {id:"we-visit", title:"We visit customers", detail:"Contractor, landscaper, cleaner, mobile service, or other field business"},
  {id:"delivery", title:"We deliver products", detail:"Local delivery, ecommerce, packaged goods, or takeout"},
  {id:"online", title:"We work online / remotely", detail:"Consulting, digital services, virtual appointments, or online business"},
];

function isValidReviewUrl(value:string){
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && (url.hostname === "google.com" || url.hostname.endsWith(".google.com") || url.hostname === "g.page" || url.hostname.endsWith(".g.page") || url.hostname === "maps.app.goo.gl");
  } catch { return false; }
}

function promptFor(category:string){
  const c=category.toLowerCase();
  if(c.includes("restaurant")) return "Enjoyed your visit?";
  if(c.includes("salon") || c.includes("barber")) return "Love your new look?";
  if(c.includes("retail") || c.includes("online")) return "Happy with your experience?";
  if(c.includes("home") || c.includes("contract")) return "Happy with our work?";
  if(c.includes("health") || c.includes("dental")) return "How was your visit?";
  return "Happy with your experience?";
}

export default function Home() {
  const [step,setStep]=useState<Step>("search");
  const [name,setName]=useState("");
  const [category,setCategory]=useState("");
  const [reviewUrl,setReviewUrl]=useState("");
  const [website,setWebsite]=useState("");
  const [address,setAddress]=useState("");
  const [color,setColor]=useState("#1f6f5f");
  const [interactions,setInteractions]=useState<Interaction[]>([]);
  const [qr,setQr]=useState("");
  const [attempted,setAttempted]=useState(false);
  const cardRef=useRef<HTMLDivElement>(null);

  const validReviewUrl=isValidReviewUrl(reviewUrl);
  const canPreview=Boolean(name.trim() && category.trim() && interactions.length && validReviewUrl);

  function toggleInteraction(id:Interaction){
    setInteractions(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);
  }

  async function buildPreview(){
    setAttempted(true);
    if(!canPreview) return;
    const data=await QRCode.toDataURL(reviewUrl.trim(),{width:900,margin:4,errorCorrectionLevel:"H",color:{dark:"#111111",light:"#FFFFFF"}});
    setQr(data);
    setStep("preview");
  }

  const initials=useMemo(()=>name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase() || "RK",[name]);
  const reviewPrompt=promptFor(category);

  async function downloadReviewCard(){
    if(!qr) return;
    const pdf=await PDFDocument.create();
    const page=pdf.addPage([252,144]);
    const regular=await pdf.embedFont(StandardFonts.Helvetica);
    const bold=await pdf.embedFont(StandardFonts.HelveticaBold);
    const hex=color.replace("#","");
    const brand=rgb(parseInt(hex.slice(0,2),16)/255,parseInt(hex.slice(2,4),16)/255,parseInt(hex.slice(4,6),16)/255);
    page.drawRectangle({x:0,y:0,width:163.5,height:144,color:brand});
    page.drawRectangle({x:163.5,y:0,width:88.5,height:144,color:rgb(1,1,1)});
    page.drawCircle({x:24,y:121,size:10,color:rgb(1,1,1)});
    const mark=initials.slice(0,2);
    page.drawText(mark,{x:24-bold.widthOfTextAtSize(mark,6)/2,y:119,size:6,font:bold,color:brand});
    const safeName=name.trim().slice(0,46);
    page.drawText(safeName,{x:38,y:118,size:safeName.length>30?6.2:7.2,font:bold,color:rgb(1,1,1),maxWidth:118});
    page.drawText("YOUR FEEDBACK MATTERS",{x:15,y:87,size:4.5,font:bold,color:rgb(.84,.93,.9)});
    const prompt=reviewPrompt;
    const promptSize=14;
    const promptMaxWidth=136;
    const promptWords=prompt.split(" ");
    const promptLines:string[]=[];
    let currentLine="";
    for(const word of promptWords){
      const candidate=currentLine ? currentLine+" "+word : word;
      if(bold.widthOfTextAtSize(candidate,promptSize)<=promptMaxWidth || !currentLine){
        currentLine=candidate;
      }else{
        promptLines.push(currentLine);
        currentLine=word;
      }
    }
    if(currentLine) promptLines.push(currentLine);
    const visibleLines=promptLines.slice(0,2);
    const firstY=visibleLines.length>1?72:66;
    visibleLines.forEach((line,index)=>page.drawText(line,{x:15,y:firstY-index*15,size:promptSize,font:bold,color:rgb(1,1,1)}));
    const bodyY=visibleLines.length>1?38:49;
    page.drawText("Share your experience with us on Google.",{x:15,y:bodyY,size:6.2,font:regular,color:rgb(1,1,1)});
    page.drawText("Thank you — your feedback helps our business grow.",{x:15,y:14,size:4.5,font:regular,color:rgb(.9,.96,.94)});
    const qrBytes=Uint8Array.from(atob(qr.split(",")[1]),ch=>ch.charCodeAt(0));
    const qrImage=await pdf.embedPng(qrBytes);
    page.drawImage(qrImage,{x:177,y:50,width:62,height:62});
    const scan="Scan to review";
    page.drawText(scan,{x:208-bold.widthOfTextAtSize(scan,6.5)/2,y:39,size:6.5,font:bold,color:rgb(.07,.1,.08)});
    const camera="Open your camera";
    page.drawText(camera,{x:208-regular.widthOfTextAtSize(camera,4.5)/2,y:30,size:4.5,font:regular,color:rgb(.42,.46,.43)});
    const bytes=await pdf.save();
    const blob=new Blob([new Uint8Array(bytes)],{type:"application/pdf"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=(name.trim().replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"")||"business")+"-review-card.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return <main>
    <header className="topbar">
      <div className="brand">Review Kit</div>
      <div className="pill">$29 one-time <span>•</span> no subscription</div>
    </header>

    {step==="search" && <section className="hero">
      <div className="eyebrow">PERSONALIZED FOR YOUR BUSINESS</div>
      <h1>Turn happy customers into more Google reviews.</h1>
      <p className="sub">Professional review materials personalized to your business and the way you work with customers.</p>
      <div className="card searchCard">
        <label>Find your business</label>
        <div className="searchRow"><input placeholder="Business name or address" disabled/><button disabled>Search</button></div>
        <p className="helper">Business search is coming next. Manual setup is fully supported and will always remain available.</p>
        <button className="linkButton" onClick={()=>setStep("manual")}>Can't find your business? Enter it manually →</button>
      </div>
      <div className="trustGrid">
        <div><strong>No design work</strong><span>we personalize it</span></div>
        <div><strong>No subscription</strong><span>one-time purchase</span></div>
        <div><strong>Preview first</strong><span>see it before buying</span></div>
      </div>
    </section>}

    {step==="manual" && <section className="builderWrap">
      <div className="builder">
        <button className="back" onClick={()=>setStep("search")}>← Back</button>
        <div className="eyebrow">BUSINESS SETUP</div>
        <h1>Tell us about your business.</h1>
        <p className="sub small">Required fields are marked *. Optional details improve personalization but will never block your kit.</p>

        <div className="formGrid">
          <label>Business name *<input value={name} maxLength={120} onChange={e=>setName(e.target.value)} placeholder="Bay Area Lawn & Landscape"/></label>
          <label>Business category *
            <select value={category} onChange={e=>setCategory(e.target.value)}>
              <option value="">Choose a category</option><option>Home Service / Contractor</option><option>Restaurant / Food</option><option>Salon / Barber / Beauty</option><option>Retail</option><option>Healthcare / Dental</option><option>Professional Service</option><option>Online Business</option><option>Other</option>
            </select>
          </label>

          <fieldset className="full interactionField">
            <legend>How do you work with your customers? *</legend>
            <p className="helper">Choose all that apply. This determines which materials go into your kit.</p>
            <div className="interactionGrid">
              {interactionOptions.map(option=><button type="button" key={option.id} className={interactions.includes(option.id)?"interaction selected":"interaction"} onClick={()=>toggleInteraction(option.id)} aria-pressed={interactions.includes(option.id)}>
                <span className="check">{interactions.includes(option.id)?"✓":""}</span><span><strong>{option.title}</strong><small>{option.detail}</small></span>
              </button>)}
            </div>
          </fieldset>

          <label className="full">Google review link *
            <input value={reviewUrl} onChange={e=>{setReviewUrl(e.target.value);setAttempted(false)}} placeholder="Paste your Google review link"/>
            <span className="helper">This is the destination used by every QR code in your kit.</span>
            {reviewUrl && !validReviewUrl && <span className="error">Enter a valid Google review link (Google, g.page, or Google Maps).</span>}
            <button type="button" className="helpLink">How do I find my Google review link?</button>
          </label>

          <label>Website <span className="optional">Optional</span><input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="yourbusiness.com"/></label>
          <label>Location / address <span className="optional">Optional</span><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="City, State or full address"/></label>
          <label>Brand color <span className="optional">Optional</span><div className="colorRow"><input className="colorInput" type="color" value={color} onChange={e=>setColor(e.target.value)}/><span>{color.toUpperCase()}</span></div></label>
          <label>Logo <span className="optional">Optional</span><input type="file" accept="image/png,image/jpeg,image/webp" disabled/><span className="helper">Logo upload is added after this setup flow is verified. Your business name works as clean text branding without one.</span></label>
        </div>

        {attempted && !canPreview && <div className="formError">Complete the required fields above before creating your preview.</div>}
        <button className="primary" onClick={buildPreview}>Create my preview →</button>
      </div>
    </section>}

    {step==="preview" && <section className="previewWrap">
      <div className="previewHead">
        <button className="back" onClick={()=>setStep("manual")}>← Edit details</button>
        <div><div className="eyebrow">PERSONALIZED PREVIEW</div><h1>{name}</h1></div>
      </div>
      <div className="previewGrid">
        <div className="reviewCard" ref={cardRef} style={{"--brand":color} as React.CSSProperties}>
          <div className="reviewCardBrand">
            <div className="reviewIdentity">
              <div className="logoDot">{initials}</div>
              <div className="assetTitle">{name}</div>
            </div>
            <div className="reviewMessage">
              <div className="reviewKicker">YOUR FEEDBACK MATTERS</div>
              <h2>{reviewPrompt}</h2>
              <p>Share your experience with us on Google.</p>
            </div>
            <div className="reviewThanks">Thank you — your feedback helps our business grow.</div>
          </div>
          <div className="reviewCardQr">
            {qr && <img src={qr} alt={"QR code linking to the Google review page for "+name}/>}
            <strong>Scan to review</strong>
            <span>Open your camera</span>
          </div>
        </div>
        <div className="detailsPanel">
          <div className="eyebrow">YOUR KIT WILL ADAPT TO YOU</div>
          <h3>Business setup confirmed</h3>
          <dl className="summary">
            <div><dt>Category</dt><dd>{category}</dd></div>
            <div><dt>Customer interaction</dt><dd>{interactions.map(id=>interactionOptions.find(x=>x.id===id)?.title).join(", ")}</dd></div>
            {website && <div><dt>Website</dt><dd>{website}</dd></div>}
            {address && <div><dt>Location</dt><dd>{address}</dd></div>}
          </dl>
          <div className="nextBox"><strong>Your review card is ready to test</strong><br/>Your QR code links directly to the Google review destination you provided. Review the design, then print or save the card to test the final size.</div>
          <div className="cardActions">
            <div><strong>Review Card · 3.5 × 2 in</strong><span>Exact 3.5 × 2 in PDF</span></div>
            <button className="primary compact" onClick={downloadReviewCard}>Download PDF</button>
          </div>
        </div>
      </div>
    </section>}
  </main>;
}