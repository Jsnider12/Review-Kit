export type TripSearch={origin:string;budget:number;travelers:number;days:number;vibe?:string;startDate?:string};
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
 return [...candidates].sort((a,b)=>{
  const aOver=a.total>search.budget?1:0,bOver=b.total>search.budget?1:0;
  if(aOver!==bOver)return aOver-bOver;
  const aUse=Math.abs(search.budget-a.total),bUse=Math.abs(search.budget-b.total);
  return aUse-bUse;
 });
}
