export type TripSearch={origin:string;budget:number;travelers:number;days:number;vibe?:string;startDate?:string;dateMode?:"Flexible"|"Exact"};
export type InventoryQuote={provider:"demo"|"duffel"|"booking"|"expedia";kind:"flight"|"stay";destination:string;amount:number;currency:"USD";live:boolean;expiresAt?:string};
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
export function assembleVacation(search:TripSearch,destination:string,quotes:InventoryQuote[]):VacationCandidate|null{
 const flight=quotes.filter(q=>q.destination===destination&&q.kind==="flight").sort((a,b)=>a.amount-b.amount)[0];
 const stay=quotes.filter(q=>q.destination===destination&&q.kind==="stay").sort((a,b)=>a.amount-b.amount)[0];
 if(!flight&&!stay)return null;
 const transport=flight?.amount??0, lodging=stay?.amount??0;
 const food=Math.round(search.days*search.travelers*55);
 const local=Math.round(search.days*38);
 const activities=Math.round(search.days*search.travelers*45);
 const buffer=Math.max(100,Math.round((transport+lodging+food+local+activities)*.08));
 const total=transport+lodging+food+local+activities+buffer;
 const liveCount=[flight,stay].filter(Boolean).filter(q=>q?.live).length;
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
