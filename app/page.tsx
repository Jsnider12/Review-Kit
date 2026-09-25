"use client";
import { useMemo, useState } from "react";
import QRCode from "qrcode";

type Step = "search" | "manual" | "preview";

export default function Home() {
  const [step,setStep]=useState<Step>("search");
  const [name,setName]=useState("Bay Area Lawn & Landscape");
  const [category,setCategory]=useState("Home Service");
  const [reviewUrl,setReviewUrl]=useState("https://www.google.com/");
  const [color,setColor]=useState("#1f6f5f");
  const [qr,setQr]=useState("");

  const canPreview = name.trim() && reviewUrl.trim();

  async function buildPreview(){
    if(!canPreview) return;
    const data = await QRCode.toDataURL(reviewUrl,{width:700,margin:2,errorCorrectionLevel:"H"});
    setQr(data);
    setStep("preview");
  }

  const initials = useMemo(()=>name.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase(),[name]);

  return <main>
    <header className="topbar">
      <div className="brand">Review Kit</div>
      <div className="pill">$29 one-time <span>•</span> no subscription</div>
    </header>

    {step==="search" && <section className="hero">
      <div className="eyebrow">PERSONALIZED FOR YOUR BUSINESS</div>
      <h1>Turn happy customers into more Google reviews.</h1>
      <p className="sub">Create a ready-to-use review kit with QR materials and follow-up messages tailored to how your business actually works.</p>

      <div className="card searchCard">
        <label>Find your business</label>
        <div className="searchRow">
          <input placeholder="Business name or address" disabled />
          <button disabled>Search</button>
        </div>
        <p className="helper">Business search will be connected next. You can already use the manual setup below.</p>
        <button className="linkButton" onClick={()=>setStep("manual")}>Can't find your business? Enter it manually →</button>
      </div>

      <div className="trustGrid">
        <div><strong>1 minute</strong><span>to set up</span></div>
        <div><strong>No login</strong><span>needed to start</span></div>
        <div><strong>Instant</strong><span>personalized preview</span></div>
      </div>
    </section>}

    {step==="manual" && <section className="builderWrap">
      <div className="builder">
        <button className="back" onClick={()=>setStep("search")}>← Back</button>
        <div className="eyebrow">MANUAL BUSINESS SETUP</div>
        <h1>Tell us about your business.</h1>
        <p className="sub small">We'll use these details to personalize your review materials.</p>

        <div className="formGrid">
          <label>Business name<input value={name} onChange={e=>setName(e.target.value)} /></label>
          <label>Business category
            <select value={category} onChange={e=>setCategory(e.target.value)}>
              <option>Home Service</option><option>Restaurant</option><option>Salon / Barber</option><option>Retail</option><option>Professional Service</option><option>Online Business</option><option>Other</option>
            </select>
          </label>
          <label className="full">Google review link<input value={reviewUrl} onChange={e=>setReviewUrl(e.target.value)} placeholder="https://g.page/r/.../review" /></label>
          <label>Brand color<input type="color" value={color} onChange={e=>setColor(e.target.value)} /></label>
          <label>Logo <input type="file" disabled /><span className="helper">Logo upload comes next. Text branding works for now.</span></label>
        </div>

        <button className="primary" onClick={buildPreview} disabled={!canPreview}>Create preview</button>
      </div>
    </section>}

    {step==="preview" && <section className="previewWrap">
      <div className="previewHead">
        <button className="back" onClick={()=>setStep("manual")}>← Edit details</button>
        <div>
          <div className="eyebrow">YOUR LIVE PREVIEW</div>
          <h1>{name}</h1>
        </div>
      </div>

      <div className="previewGrid">
        <div className="asset" style={{"--brand":color} as React.CSSProperties}>
          <div className="logoDot">{initials}</div>
          <div className="assetTitle">{name}</div>
          <h2>Happy with our service?</h2>
          <p>We'd really appreciate your feedback.</p>
          {qr && <img src={qr} alt="QR code preview" />}
          <div className="scan">Scan to leave us a Google review</div>
        </div>

        <div className="detailsPanel">
          <h3>What this proves</h3>
          <ul>
            <li>Your business details flow into the design.</li>
            <li>Your review link becomes a real scannable QR code.</li>
            <li>The output adapts to your branding.</li>
            <li>Manual entry works even before business search is connected.</li>
          </ul>
          <div className="nextBox"><strong>Next build step</strong><br/>Add business search, logo upload, and downloadable PNG/PDF assets.</div>
        </div>
      </div>
    </section>}
  </main>;
}
