export type TripSearch={origin:string;budget:number;travelers:number;days:number;vibe?:string;startDate?:string;dateMode?:"Flexible"|"Exact"};
const addDays=(date:string,days:number)=>{const d=new Date(date+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)};
export type OnTripCostProfile={foodPerPersonDay?:number;localPerDay?:number;activitiesPerPersonDay?:number;bufferRate?:number};
export type InventoryQuote={provider:"demo"|"duffel"|"booking"|"expedia";kind:"flight"|"stay";destination:string;amount:number;currency:"USD";live:boolean;expiresAt?:string;startDate?:string;endDate?:string;travelers?:number};
const hasInvalidExpiry=(q:InventoryQuote)=>Boolean(q.expiresAt&&!Number.isFinite(Date.parse(q.expiresAt)));
const isExpired=(q:InventoryQuote)=>Boolean(q.expiresAt&&Number.isFinite(Date.parse(q.expiresAt))&&Date.parse(q.expiresAt)<=Date.now());
const matchesSearch=(q:InventoryQuote,search:TripSearch)=>{
 if(q.travelers!==undefined&&q.travelers!==search.travelers)return false;
 if(search.dateMode==="Exact"&&search.startDate){
  if(q.startDate&&q.startDate!==search.startDate)return false;
  const expectedEnd=addDays(search.startDate,search.days);
  if(q.kind==="stay"&&q.endDate&&q.endDate!==expectedEnd)return false;
 }
 return true;
};
export type VacationCandidate={destination:string;country:string;transport:number;stay:number;food:number;local:number;activities:number;buffer:number;total:number;confidence:"estimate"|"mixed"|"live";sources:string[];discovery?:boolean};

export interface InventoryProvider {
  searchFlights?(search:TripSearch,destinations:string[]):Promise<InventoryQuote[]>;
  searchStays?(search:TripSearch,destinations:string[]):Promise<InventoryQuote[]>;
}

/**
 * Supplier-neutral trip engine boundary.
 * UI should consume VacationCandidate objects, never a vendor-specific response.
 * This lets us combine/replace flight, hotel and activity providers without rebuilding the product.
 */
export function assembleVacation(search:TripSearch,destination:string,quotes:InventoryQuote[],costs:OnTripCostProfile={}):VacationCandidate|null{
 const flight=quotes.filter(q=>q.destination===destination&&q.kind==="flight"&&!hasInvalidExpiry(q)&&!isExpired(q)&&matchesSearch(q,search)).sort((a,b)=>a.amount-b.amount)[0];
 const stay=quotes.filter(q=>q.destination===destination&&q.kind==="stay"&&!hasInvalidExpiry(q)&&!isExpired(q)&&matchesSearch(q,search)).sort((a,b)=>a.amount-b.amount)[0];
 // A complete vacation cannot silently treat a missing core component as free.
 // Ground-trip support can be modeled explicitly later; flight-based candidates require both.
 if(!flight||!stay)return null;
 const transport=flight.amount, lodging=stay.amount;
 const food=Math.round(search.days*search.travelers*(costs.foodPerPersonDay??55));
 const local=Math.round(search.days*(costs.localPerDay??38));
 const activities=Math.round(search.days*search.travelers*(costs.activitiesPerPersonDay??45));
 const buffer=Math.max(100,Math.round((transport+lodging+food+local+activities)*(costs.bufferRate??.08)));
 const total=transport+lodging+food+local+activities+buffer;
 const liveCount=[flight,stay].filter(q=>q.live).length;
 return {destination,country:"",transport,stay:lodging,food,local,activities,buffer,total,confidence:liveCount===2?"live":liveCount===1?"mixed":"estimate",sources:[flight?.provider,stay?.provider].filter(Boolean) as string[]};
}

export function rankVacations(search:TripSearch,candidates:VacationCandidate[]){
 const score=(trip:VacationCandidate)=>{
  const ratio=trip.total/search.budget;
  // Best-fit trips should use the spend meaningfully without rewarding needless cost.
  const spendFit=ratio<=1?100-Math.abs(.82-ratio)*90:55-Math.min(45,(ratio-1)*180);
  const discoveryBonus=trip.discovery?6:0;
  const confidenceBonus=trip.confidence==="live"?8:trip.confidence==="mixed"?4:0;
  return spendFit+discoveryBonus+confidenceBonus;
 };
 return [...candidates].sort((a,b)=>score(b)-score(a)||a.total-b.total);
}
