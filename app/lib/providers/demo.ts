import type {InventoryProvider,InventoryQuote,TripSearch} from "../trip-engine";

const BASE=[
["New Orleans",0,438],["Cancún",520,690],["Denver",410,585],["Big Bend",240,520],
["San Juan",650,760],["Nashville",365,510],["Destin",310,760],["Las Vegas",390,590],
["Mexico City",490,540],["Guanacaste",720,820],["San Diego",520,880],
["Great Smoky Mountains",280,690],["New York City",560,1120],["Chicago",420,720]
] as const;

export const destinations=BASE.map(([name])=>name);

export const demoProvider:InventoryProvider={
 async searchFlights(search:TripSearch,names:string[]){
  return BASE.filter(([name])=>names.includes(name)).map(([destination,transport])=>({
   provider:"demo",kind:"flight",destination,amount:Math.round(transport*(search.travelers/2)),currency:"USD",live:false
  } satisfies InventoryQuote));
 },
 async searchStays(search:TripSearch,names:string[]){
  return BASE.filter(([name])=>names.includes(name)).map(([destination,,stay])=>({
   provider:"demo",kind:"stay",destination,amount:Math.round(stay*(search.days/4)),currency:"USD",live:false
  } satisfies InventoryQuote));
 }
};