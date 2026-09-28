import type {InventoryProvider,InventoryQuote,TripSearch} from "../trip-engine";

export type DestinationProfile={name:string;country:string;vibes:string[];transport:number;stay:number};
export const destinationProfiles:DestinationProfile[]=[
{name:"New Orleans",country:"USA",vibes:["Culture","City"],transport:0,stay:438},
{name:"Cancún",country:"Mexico",vibes:["Beach"],transport:520,stay:690},
{name:"Denver",country:"USA",vibes:["Adventure","City"],transport:410,stay:585},
{name:"Big Bend",country:"USA",vibes:["Outdoors","Adventure"],transport:240,stay:520},
{name:"San Juan",country:"Puerto Rico",vibes:["Beach","Culture"],transport:650,stay:760},
{name:"Nashville",country:"USA",vibes:["Culture","Nightlife"],transport:365,stay:510},
{name:"Destin",country:"USA",vibes:["Beach"],transport:310,stay:760},
{name:"Las Vegas",country:"USA",vibes:["Nightlife","City"],transport:390,stay:590},
{name:"Mexico City",country:"Mexico",vibes:["Culture","City"],transport:490,stay:540},
{name:"Guanacaste",country:"Costa Rica",vibes:["Beach","Adventure"],transport:720,stay:820},
{name:"San Diego",country:"USA",vibes:["Beach","City"],transport:520,stay:880},
{name:"Great Smoky Mountains",country:"USA",vibes:["Outdoors","Adventure"],transport:280,stay:690},
{name:"New York City",country:"USA",vibes:["City","Culture"],transport:560,stay:1120},
{name:"Chicago",country:"USA",vibes:["City","Culture"],transport:420,stay:720}
];

export function matchingDestinations(vibe?:string){
 return destinationProfiles.filter(d=>!vibe||vibe==="Any"||d.vibes.includes(vibe));
}

export const demoProvider:InventoryProvider={
 async searchFlights(search:TripSearch,names:string[]){
  return destinationProfiles.filter(d=>names.includes(d.name)).map(d=>({
   provider:"demo",kind:"flight",destination:d.name,amount:Math.round(d.transport*(search.travelers/2)),currency:"USD",live:false
  } satisfies InventoryQuote));
 },
 async searchStays(search:TripSearch,names:string[]){
  return destinationProfiles.filter(d=>names.includes(d.name)).map(d=>({
   provider:"demo",kind:"stay",destination:d.name,amount:Math.round(d.stay*(search.days/4)),currency:"USD",live:false
  } satisfies InventoryQuote));
 }
};