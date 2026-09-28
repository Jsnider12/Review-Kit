import {NextResponse} from "next/server";
import {rankVacations,type TripSearch,type VacationCandidate} from "../../lib/trip-engine";

const inventory=[
["New Orleans","USA",0,438],["Cancún","Mexico",520,690],["Denver","USA",410,585],["Big Bend","USA",240,520],
["San Juan","Puerto Rico",650,760],["Nashville","USA",365,510],["Destin","USA",310,760],["Las Vegas","USA",390,590],
["Mexico City","Mexico",490,540],["Guanacaste","Costa Rica",720,820],["San Diego","USA",520,880],["Great Smoky Mountains","USA",280,690],
["New York City","USA",560,1120],["Chicago","USA",420,720]
] as const;

export async function POST(req:Request){
 const search=await req.json() as TripSearch;
 const candidates:VacationCandidate[]=inventory.map(([destination,country,transport,stay])=>{
  const scalePeople=search.travelers/2, scaleDays=search.days/4;
  const t=Math.round(transport*scalePeople),s=Math.round(stay*scaleDays);
  const food=Math.round(search.days*search.travelers*55);
  const local=Math.round(search.days*38);
  const activities=Math.round(search.days*search.travelers*45);
  const buffer=Math.max(100,Math.round((t+s+food+local+activities)*.08));
  return {destination,country,transport:t,stay:s,food,local,activities,buffer,total:t+s+food+local+activities+buffer,confidence:"estimate",sources:["demo"]};
 });
 return NextResponse.json({mode:"demo",notice:"Validation estimates — live provider adapters are not enabled yet.",results:rankVacations(search,candidates)});
}