import {NextResponse} from "next/server";

export async function POST(req:Request){
  try{
    const {query}=await req.json();
    const q=String(query||"").trim();
    if(q.length<3)return NextResponse.json({error:"Enter a business name and city or address."},{status:400});
    const key=process.env.GOOGLE_MAPS_API_KEY;
    if(!key)return NextResponse.json({error:"Business search is not configured yet."},{status:503});
    const response=await fetch("https://places.googleapis.com/v1/places:searchText",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "X-Goog-Api-Key":key,
        "X-Goog-FieldMask":"places.id,places.displayName,places.formattedAddress,places.types,places.websiteUri"
      },
      body:JSON.stringify({textQuery:q,pageSize:6,includePureServiceAreaBusinesses:true}),
      cache:"no-store"
    });
    if(!response.ok)return NextResponse.json({error:"Google business search is temporarily unavailable."},{status:502});
    const data=await response.json();
    const places=(data.places||[]).map((p:any)=>({
      id:p.id,
      name:p.displayName?.text||"",
      address:p.formattedAddress||"Service-area business",
      types:p.types||[],
      website:p.websiteUri||""
    })).filter((p:any)=>p.id&&p.name);
    return NextResponse.json({places});
  }catch{
    return NextResponse.json({error:"Unable to search businesses right now."},{status:500});
  }
}
