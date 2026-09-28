import type {InventoryProvider,InventoryQuote,TripSearch} from "../trip-engine";

export type DestinationProfile={name:string;country:string;vibes:string[];transport:number;stay:number;tag:string;emoji:string;discovery?:boolean};
export const destinationProfiles:DestinationProfile[]=[
{name:"New Orleans",country:"USA",vibes:["Culture","City"],transport:0,stay:438,tag:"Food + culture",emoji:"⚜️"},
{name:"Cancún",country:"Mexico",vibes:["Beach"],transport:520,stay:690,tag:"Caribbean escape",emoji:"🌴"},
{name:"Denver",country:"USA",vibes:["Adventure","City"],transport:410,stay:585,tag:"Mountains + city",emoji:"🏔️"},
{name:"Big Bend",country:"USA",vibes:["Outdoors","Adventure"],transport:240,stay:520,tag:"Desert road trip",emoji:"🌵"},
{name:"San Juan",country:"Puerto Rico",vibes:["Beach","Culture"],transport:650,stay:760,tag:"Island + old city",emoji:"🌊"},
{name:"Nashville",country:"USA",vibes:["Culture","Nightlife"],transport:365,stay:510,tag:"Music weekend",emoji:"🎸"},
{name:"Destin",country:"USA",vibes:["Beach"],transport:310,stay:760,tag:"Gulf beach",emoji:"☀️"},
{name:"Las Vegas",country:"USA",vibes:["Nightlife","City"],transport:390,stay:590,tag:"Entertainment",emoji:"🎲"},
{name:"Mexico City",country:"Mexico",vibes:["Culture","City"],transport:490,stay:540,tag:"Food + design",emoji:"🌮"},
{name:"Guanacaste",country:"Costa Rica",vibes:["Beach","Adventure"],transport:720,stay:820,tag:"Beach + adventure",emoji:"🦥"},
{name:"San Diego",country:"USA",vibes:["Beach","City"],transport:520,stay:880,tag:"Coast + city",emoji:"🌅"},
{name:"Great Smoky Mountains",country:"USA",vibes:["Outdoors","Adventure"],transport:280,stay:690,tag:"Cabin + outdoors",emoji:"🌲"},
{name:"New York City",country:"USA",vibes:["City","Culture"],transport:560,stay:1120,tag:"Big city energy",emoji:"🗽"},
{name:"Chicago",country:"USA",vibes:["City","Culture"],transport:420,stay:720,tag:"Food + architecture",emoji:"🏙️"},
{name:"Maui",country:"USA",vibes:["Beach","Adventure"],transport:1450,stay:1850,tag:"Hawaiian escape",emoji:"🌺"},
{name:"Aruba",country:"Aruba",vibes:["Beach"],transport:1180,stay:1760,tag:"One happy island",emoji:"🏝️"},
{name:"Belize",country:"Belize",vibes:["Beach","Adventure"],transport:980,stay:1420,tag:"Reef + rainforest",emoji:"🐠"},
{name:"Vancouver",country:"Canada",vibes:["City","Outdoors"],transport:920,stay:1380,tag:"City + wild coast",emoji:"🏔️"},
{name:"London",country:"United Kingdom",vibes:["City","Culture"],transport:1580,stay:1640,tag:"Classic city escape",emoji:"🇬🇧"},
{name:"Paris",country:"France",vibes:["City","Culture"],transport:1660,stay:1720,tag:"Food + iconic streets",emoji:"🇫🇷"},
{name:"Rome",country:"Italy",vibes:["Culture","City"],transport:1720,stay:1540,tag:"History + food",emoji:"🇮🇹"},
{name:"Reykjavík",country:"Iceland",vibes:["Adventure","Outdoors"],transport:1420,stay:1480,tag:"Fire + ice",emoji:"🇮🇸"},
{name:"Bora Bora",country:"French Polynesia",vibes:["Beach"],transport:4200,stay:6200,tag:"Overwater escape",emoji:"🌊"},
{name:"Maldives",country:"Maldives",vibes:["Beach"],transport:3900,stay:5900,tag:"Private island retreat",emoji:"🏝️"},
{name:"Tokyo",country:"Japan",vibes:["City","Culture"],transport:2400,stay:2500,tag:"Food + discovery",emoji:"🗼"},
{name:"Amalfi Coast",country:"Italy",vibes:["Beach","Culture"],transport:2500,stay:3900,tag:"Italian coast",emoji:"🍋"},
{name:"Swiss Alps",country:"Switzerland",vibes:["Outdoors","Adventure"],transport:2600,stay:4100,tag:"Alpine escape",emoji:"🏔️"},
{name:"Madeira",country:"Portugal",vibes:["Outdoors","Adventure"],transport:1750,stay:1320,tag:"Atlantic island escape",emoji:"🌿",discovery:true},
{name:"São Miguel",country:"Azores, Portugal",vibes:["Outdoors","Adventure"],transport:1680,stay:1180,tag:"Volcanic island",emoji:"🌋",discovery:true},
{name:"Ljubljana",country:"Slovenia",vibes:["Culture","Outdoors"],transport:1820,stay:980,tag:"Alps + old town",emoji:"🏞️",discovery:true},
{name:"Cartagena",country:"Colombia",vibes:["Beach","Culture"],transport:980,stay:1050,tag:"Caribbean color",emoji:"🌺",discovery:true},
{name:"Antigua",country:"Guatemala",vibes:["Culture","Adventure"],transport:760,stay:820,tag:"Volcano + colonial city",emoji:"🌋",discovery:true},
{name:"Québec City",country:"Canada",vibes:["Culture","City"],transport:980,stay:1120,tag:"Old-world weekend",emoji:"🏰",discovery:true},
{name:"Curaçao",country:"Curaçao",vibes:["Beach","Culture"],transport:1280,stay:1480,tag:"Colorful Caribbean",emoji:"🐚",discovery:true},
{name:"Oaxaca",country:"Mexico",vibes:["Culture","City"],transport:820,stay:720,tag:"Food + mezcal country",emoji:"🌵",discovery:true}
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