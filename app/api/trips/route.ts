import {NextResponse} from "next/server";
import {assembleVacation,rankVacations,type TripSearch} from "../../lib/trip-engine";
import {demoDiscoveryProvider,demoProvider,matchingDestinations,onTripCosts} from "../../lib/providers/demo";

export async function POST(req:Request){
 try{
  const search=await req.json() as TripSearch;
  if(!search||typeof search!=="object")return NextResponse.json({error:"Check your trip details and try again."},{status:400});
  const validDate=!search.startDate||(/^\d{4}-\d{2}-\d{2}$/.test(search.startDate)&&!Number.isNaN(Date.parse(search.startDate))&&new Date(search.startDate).toISOString().slice(0,10)===search.startDate);
  const exactDateValid=search.dateMode!=="Exact"||Boolean(search.startDate&&validDate);
  const today=new Date().toISOString().slice(0,10);
  const futureDateValid=search.dateMode!=="Exact"||Boolean(search.startDate&&search.startDate>=today);
  if(typeof search.origin!=="string"||!search.origin.trim()||search.origin.length>120||!Number.isFinite(search.budget)||search.budget<100||search.budget>100000||!Number.isInteger(search.travelers)||search.travelers<1||search.travelers>20||!Number.isInteger(search.days)||search.days<2||search.days>30||!validDate||!exactDateValid||!futureDateValid){
   const error=typeof search.origin!=="string"||!search.origin.trim()?"Tell us where you’re leaving from.":search.origin.length>120?"Origin is too long. Try a city or airport code.":!Number.isFinite(search.budget)||search.budget<100||search.budget>100000?"Choose a trip budget between $100 and $100,000.":!Number.isInteger(search.travelers)||search.travelers<1||search.travelers>20?"Choose between 1 and 20 travelers.":!Number.isInteger(search.days)||search.days<2||search.days>30?"Choose a trip length between 2 and 30 days.":!validDate?"Use a valid start date.":!exactDateValid?"Choose a start date for an exact-date search.":!futureDateValid?"Choose a future start date.":"Check your trip details and try again.";
   return NextResponse.json({error},{status:400});
  }

  if(search.vibe&&!(["Any","Beach","Adventure","Outdoors","Culture","City","Nightlife"].includes(search.vibe)))return NextResponse.json({error:"Choose a valid travel style."},{status:400});
  const normalizedOrigin=search.origin.toLowerCase();
  // Demo geography is intentionally conservative: detect only regions we can
  // identify confidently from free-form origin text. Live inventory/geocoding
  // will replace this with actual origin-to-destination distance and travel time.
  const originRules:[RegExp,string][]=[
   [/\b(tx|texas)\b|houston|friendswood|webster|clear lake|pearland|league city|galveston/,"Texas"],
   [/\b(ca|california)\b|\bla\b|los angeles|san diego|san francisco|sacramento|san jose/,"California"],
   [/\b(fl|florida)\b|miami|orlando|tampa|jacksonville|pensacola|destin/,"Florida"],
   [/\blouisiana\b|new orleans|lafayette|baton rouge/,"Louisiana"],
   [/\b(co|colorado)\b|denver/,"Colorado"],
   [/\b(nv|nevada)\b|las vegas/,"Nevada"],
   [/\b(ny|new york)\b|new york city|nyc/,"New York"],
   [/\b(il|illinois)\b|chicago/,"Illinois"],
   [/\b(tn|tennessee)\b|nashville|memphis/,"Tennessee"],
   [/\b(hi|hawaii)\b|honolulu|maui/,"Hawaii"],
   [/\b(pr|puerto rico)\b|san juan/,"Puerto Rico"],
   [/\b(ar|arkansas)\b|hot springs|little rock/,"Arkansas"],
   [/\b(mo|missouri)\b|kansas city|st louis|st. louis/,"Missouri"]
  ];
  const originRegion=originRules.find(([rule])=>rule.test(normalizedOrigin))?.[1];
  const escapeWorthy=(p:ReturnType<typeof matchingDestinations>[number])=>{
   if(!originRegion||p.region!==originRegion)return true;
   // Short trips can legitimately be regional getaways. Longer vacations
   // should create more separation from home instead of filling results with
   // familiar same-region cities merely because they are inexpensive.
   return search.days<=2;
  };
  const discovered=await demoDiscoveryProvider.discover(search);
  const discoveredNames=new Set(discovered.map(d=>d.name));
  const profiles=matchingDestinations(search.vibe).filter(d=>discoveredNames.has(d.name)).filter(escapeWorthy);
  const destinations=profiles.map(d=>d.name);
  const profileMap=new Map(profiles.map(d=>[d.name,d]));
  const [flights,stays]=await Promise.all([
   demoProvider.searchFlights?.(search,destinations)??[],
   demoProvider.searchStays?.(search,destinations)??[]
  ]);
  const quotes=[...flights,...stays].filter(q=>q&&typeof q.destination==="string"&&q.destination.trim()&&Number.isFinite(q.amount)&&q.amount>0&&(q.kind==="flight"||q.kind==="stay"));
  const results=destinations.map(destination=>{const profile=profileMap.get(destination);const trip=assembleVacation(search,destination,quotes,profile?onTripCosts(profile):{});return trip?{...trip,country:profile?.country??"",tag:profile?.tag??"Trip idea",emoji:profile?.emoji??"✦",vibes:profile?.vibes??[],discovery:profile?.discovery??false,image:profile?.image??"",imageAlt:profile?.imageAlt??"",conceptTitle:profile?.conceptTitle??"",stayStyle:profile?.stayStyle??"",highlights:profile?.highlights??[]}:null}).filter(x=>x!==null);
  const rankedForDiscovery=rankVacations(search,results);
  // Surprise Me should feel aspirational, not like a random cheap result.
  // Prefer trips that use a meaningful share of the user's spend, then broaden
  // only when the search would otherwise have too little variety.
  const strongRoulette=rankedForDiscovery.filter(x=>x.total<=search.budget&&x.total>=search.budget*.48);
  const rouletteFits=strongRoulette.length>=5?strongRoulette:rankedForDiscovery.filter(x=>x.total<=search.budget&&x.total>=search.budget*.35);
  const roulette:(typeof rouletteFits)=[]; const addRoulette=(x:(typeof rouletteFits)[number]|undefined)=>{if(x&&!roulette.some(r=>r.destination===x.destination))roulette.push(x)};
  // Build a varied spin: exciting/discovery and travel-style diversity first,
  // then fill with the strongest remaining budget fits.
  addRoulette(rouletteFits.find(x=>x.discovery&&x.total>=search.budget*.62));
  addRoulette(rouletteFits.find(x=>x.total>=search.budget*.72));
  for(const style of ["Beach","Adventure","Culture","City","Outdoors","Nightlife"])addRoulette(rouletteFits.find(x=>profileMap.get(x.destination)?.vibes.includes(style)));
  for(const trip of rouletteFits.filter(x=>x.discovery))addRoulette(trip);
  for(const trip of rouletteFits)addRoulette(trip);
  roulette.splice(16);
  return NextResponse.json({
   mode:"demo",
   notice:"Validation estimates — live provider adapters are not enabled yet.",
   roulette,
   results:(()=>{
    const ranked=rankVacations(search,results);
    // Keep discovery relevant to the spend. A modest stretch can be useful;
    // wildly unaffordable trips belong to a different search, not the bottom of this one.
    const ceiling=search.budget*1.25;
    const relevant=ranked.filter(x=>x.total<=ceiling);
    const fits=relevant.filter(x=>x.total<=search.budget);
    const stretches=relevant.filter(x=>x.total>search.budget);
    if(!relevant.length)return [];
    // If nothing fits, show only a few nearby stretch ideas rather than a wall
    // of over-budget vacations. The UI can then invite a budget/date adjustment.
    if(!fits.length)return relevant.slice(0,3);
    const chosen:typeof ranked=[];
    const add=(x:(typeof ranked)[number]|undefined)=>{if(x&&!chosen.some(c=>c.destination===x.destination))chosen.push(x)};
    add(fits.find(x=>x.total>=search.budget*.72));
    add(fits.find(x=>x.discovery&&x.total>=search.budget*.45));
    add(fits.find(x=>x.total>=search.budget*.48&&x.total<search.budget*.72));
    // Preserve one clear value alternative without letting cheap trips dominate.
    add(fits.find(x=>x.total<search.budget*.48));
    add(fits.find(x=>x.discovery));
    // Fill primarily with vacations that actually fit. Include at most two
    // nearby stretch ideas, and only after the useful in-budget choices.
    for(const trip of fits)add(trip);
    for(const trip of stretches.slice(0,2))add(trip);
    return chosen.slice(0,12);
   })()
  },{headers:{"Cache-Control":"no-store"}});
 }catch{
  return NextResponse.json({error:"Unable to build trips."},{status:500});
 }
}