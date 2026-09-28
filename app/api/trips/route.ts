import {NextResponse} from "next/server";
import {assembleVacation,rankVacations,type TripSearch} from "../../lib/trip-engine";
import {demoProvider,matchingDestinations,onTripCosts} from "../../lib/providers/demo";

export async function POST(req:Request){
 try{
  const search=await req.json() as TripSearch;
  const validDate=!search.startDate||/^\\d{4}-\\d{2}-\\d{2}$/.test(search.startDate);
  const exactDateValid=search.dateMode!=="Exact"||Boolean(search.startDate&&validDate);
  const today=new Date().toISOString().slice(0,10);
  const futureDateValid=search.dateMode!=="Exact"||Boolean(search.startDate&&search.startDate>=today);
  if(!search.origin?.trim()||search.origin.length>120||!Number.isFinite(search.budget)||search.budget<100||search.budget>100000||!Number.isInteger(search.travelers)||search.travelers<1||search.travelers>20||!Number.isInteger(search.days)||search.days<1||search.days>30||!validDate||!exactDateValid||!futureDateValid){
   return NextResponse.json({error:"Invalid trip search."},{status:400});
  }

  const profiles=matchingDestinations(search.vibe);
  const destinations=profiles.map(d=>d.name);
  const profileMap=new Map(profiles.map(d=>[d.name,d]));
  const [flights,stays]=await Promise.all([
   demoProvider.searchFlights?.(search,destinations)??[],
   demoProvider.searchStays?.(search,destinations)??[]
  ]);
  const quotes=[...flights,...stays].filter(q=>q&&typeof q.destination==="string"&&q.destination.trim()&&Number.isFinite(q.amount)&&q.amount>0&&(q.kind==="flight"||q.kind==="stay"));
  const results=destinations.map(destination=>{const profile=profileMap.get(destination);const trip=assembleVacation(search,destination,quotes,profile?onTripCosts(profile):{});return trip?{...trip,country:profile?.country??"",tag:profile?.tag??"Trip idea",emoji:profile?.emoji??"✦",vibes:profile?.vibes??[],discovery:profile?.discovery??false}:null}).filter(x=>x!==null);
  return NextResponse.json({
   mode:"demo",
   notice:"Validation estimates — live provider adapters are not enabled yet.",
   results:(()=>{
    const ranked=rankVacations(search,results);
    const fits=ranked.filter(x=>x.total<=search.budget);
    if(!fits.length)return ranked;
    const chosen:typeof ranked=[];
    const add=(x:(typeof ranked)[number]|undefined)=>{if(x&&!chosen.some(c=>c.destination===x.destination))chosen.push(x)};
    add(fits.find(x=>x.total>=search.budget*.72));
    add(fits.find(x=>x.discovery&&x.total>=search.budget*.45));
    add(fits.find(x=>x.total>=search.budget*.48&&x.total<search.budget*.72));
    // Preserve one clear value alternative without letting cheap trips dominate.
    add(fits.find(x=>x.total<search.budget*.48));
    add(fits.find(x=>x.discovery));
    for(const trip of ranked)add(trip);
    return chosen;
   })()
  });
 }catch{
  return NextResponse.json({error:"Unable to build trips."},{status:500});
 }
}