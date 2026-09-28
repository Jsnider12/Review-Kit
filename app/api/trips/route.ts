import {NextResponse} from "next/server";
import {assembleVacation,rankVacations,type TripSearch} from "../../lib/trip-engine";
import {demoProvider,destinations} from "../../lib/providers/demo";

export async function POST(req:Request){
 try{
  const search=await req.json() as TripSearch;
  if(!search.origin||!Number.isFinite(search.budget)||search.budget<=0||!Number.isFinite(search.travelers)||search.travelers<1||!Number.isFinite(search.days)||search.days<1){
   return NextResponse.json({error:"Invalid trip search."},{status:400});
  }

  const [flights,stays]=await Promise.all([
   demoProvider.searchFlights?.(search,destinations)??[],
   demoProvider.searchStays?.(search,destinations)??[]
  ]);
  const quotes=[...flights,...stays];
  const results=destinations.map(destination=>assembleVacation(search,destination,quotes)).filter(x=>x!==null);
  return NextResponse.json({
   mode:"demo",
   notice:"Validation estimates — live provider adapters are not enabled yet.",
   results:rankVacations(search,results)
  });
 }catch{
  return NextResponse.json({error:"Unable to build trips."},{status:500});
 }
}