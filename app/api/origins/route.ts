import {NextRequest,NextResponse} from "next/server";
import {localOrigins,type OriginSuggestion} from "../../lib/origins";

type Prediction={placePrediction?:{text?:{text?:string};structuredFormat?:{mainText?:{text?:string};secondaryText?:{text?:string}}}};
async function googleOrigins(query:string,key:string,kind:"City"|"Airport"):Promise<OriginSuggestion[]>{
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),2500);
 try{
  const response=await fetch("https://places.googleapis.com/v1/places:autocomplete",{method:"POST",headers:{"Content-Type":"application/json","X-Goog-Api-Key":key,"X-Goog-FieldMask":"suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat"},body:JSON.stringify({input:query,includedPrimaryTypes:kind==="City"?["(cities)"]:["airport"]}),signal:controller.signal,cache:"no-store"});
  if(!response.ok)return [];
  const data=await response.json() as {suggestions?:Prediction[]};
  return (data.suggestions||[]).flatMap(s=>{const p=s.placePrediction;const label=p?.text?.text?.trim();if(!label)return [];return [{label,detail:p?.structuredFormat?.secondaryText?.text||kind,kind,source:"google" as const}]}).slice(0,5);
 }catch{return []}finally{clearTimeout(timer)}
}
export async function GET(req:NextRequest){
 const query=(req.nextUrl.searchParams.get("q")||"").trim();
 if(query.length<2||query.length>80)return NextResponse.json({suggestions:[]},{headers:{"Cache-Control":"no-store"}});
 const local=localOrigins(query),key=process.env.GOOGLE_PLACES_AUTOCOMPLETE_ENABLED==="true"?process.env.GOOGLE_MAPS_API_KEY:undefined;
 if(!key)return NextResponse.json({suggestions:local},{headers:{"Cache-Control":"no-store"}});
 const remote=(await Promise.all([googleOrigins(query,key,"City"),googleOrigins(query,key,"Airport")])).flat();
 const unique=new Map<string,OriginSuggestion>();for(const item of [...local,...remote])unique.set(item.label.toLowerCase(),item);
 return NextResponse.json({suggestions:[...unique.values()].slice(0,8)},{headers:{"Cache-Control":"no-store"}});
}
