export type Trip={id:string;place:string;region:string;emoji:string;tag:string;vibe:string;base:number;transport:number;stay:number;spend:number;total:number;confidence?:"estimate"|"mixed"|"live";discovery?:boolean;image?:string;imageAlt?:string;imageCredit?:string;imageSource?:string;conceptTitle?:string;stayStyle?:string;highlights?:string[];origin?:string;travelers?:number;days?:number;budget?:number};

export function isSavedTrip(value:unknown):value is Trip{
 if(!value||typeof value!=="object")return false;
 const trip=value as Trip;
 if(![trip.id,trip.place,trip.region,trip.vibe].every(s=>typeof s==="string"&&s.length>0))return false;
 if(![trip.total,trip.transport,trip.stay,trip.spend].every(n=>Number.isFinite(n)&&n>=0)||trip.total<=0)return false;
 if(Math.abs(trip.total-trip.transport-trip.stay-trip.spend)>1)return false;
 if([trip.emoji,trip.tag,trip.image,trip.imageAlt,trip.imageCredit,trip.imageSource,trip.conceptTitle,trip.stayStyle,trip.origin].some(s=>s!==undefined&&typeof s!=="string"))return false;
 if(trip.highlights!==undefined&&(!Array.isArray(trip.highlights)||trip.highlights.some(s=>typeof s!=="string")))return false;
 if(trip.days!==undefined&&(!Number.isInteger(trip.days)||trip.days<2||trip.days>30))return false;
 if(trip.travelers!==undefined&&(!Number.isInteger(trip.travelers)||trip.travelers<1||trip.travelers>20))return false;
 if(trip.budget!==undefined&&(!Number.isFinite(trip.budget)||trip.budget<100||trip.budget>100000))return false;
 return true;
}

export function restoreShortlist(idsValue:unknown,tripsValue:unknown):{ids:string[];trips:Trip[]}{
 const trips=Array.isArray(tripsValue)?[...new Map(tripsValue.filter(isSavedTrip).map(t=>[t.id,t])).values()].slice(-50):[];
 const available=new Set(trips.map(t=>t.id));
 const ids=Array.isArray(idsValue)?[...new Set(idsValue.filter((id):id is string=>typeof id==="string"&&available.has(id)))].slice(-50):[];
 return {ids,trips:trips.filter(t=>ids.includes(t.id))};
}
