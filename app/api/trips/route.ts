import {NextResponse} from "next/server";
import {assembleVacation,rankVacations,type TripSearch} from "../../lib/trip-engine";
import {demoProvider,matchingDestinations} from "../../lib/providers/demo";

export async function POST(req:Request){
 try{
  const search=await req.json() as TripSearch;
  const validDate=!search.startDate||/^\\d{4}-\\d{2}-\\d{2}$/.test(search.startDate);
  if(!search.origin?.trim()||search.origin.length>120||!Number.isFinite(search.budget)||search.budget<100||search.budget>100000||!Number.isInteger(search.travelers)||search.travelers<1||search.travelers>20||!Number.isInteger(search.days)||search.days<1||search.days>30||!validDate){
   return NextResponse.json({error:"Invalid trip search."},{status:400});
  }

  const profiles=matchingDestinations(search.vibe);
  const destinations=profiles.map(d=>d.name);
  const profileMap=new Map(profiles.map(d=>[d.name,d]));
  const [flights,stays]=await Promise.all([
   demoProvider.searchFlights?.(search,destinations)??[],
   demoProvider.searchStays?.(search,destinations)??[]
  ]);
  const quotes=[...flights,...stays];
  const results=destinations.map(destination=>{const trip=assembleVacation(search,destination,quotes);const profile=profileMap.get(destination);return trip?{...trip,country:profile?.country??"",tag:profile?.tag??"Trip idea",emoji:profile?.emoji??"✦",vibes:profile?.vibes??[],discovery:profile?.discovery??false}:null}).filter(x=>x!==null);
  return NextResponse.json({
   mode:"demo",
   notice:"Validation estimates — live provider adapters are not enabled yet.",
   results:(()=>{const ranked=rankVacations(search,results);const discoveries=ranked.filter(x=>x.discovery&&x.total<=search.budget);if(!discoveries.length)return ranked;const pick=discoveries[0];const rest=ranked.filter(x=>x.destination!==pick.destination);return [...rest.slice(0,3),pick,...rest.slice(3)];})()
  });
 }catch{
  return NextResponse.json({error:"Unable to build trips."},{status:500});
 }
}