import type {InventoryProvider,InventoryQuote,TripSearch} from "../trip-engine";

export type DestinationProfile={name:string;country:string;vibes:string[];transport:number;stay:number;tag:string;emoji:string;image:string;imageAlt:string;discovery?:boolean;costLevel?:"value"|"standard"|"premium"|"luxury";houstonLocal?:boolean};
export const destinationProfiles:DestinationProfile[]=[
{name:"New Orleans",country:"USA",vibes:["Culture","City"],transport:360,stay:438,tag:"Food + culture",emoji:"⚜️",costLevel:"value",image:"https://images.unsplash.com/photo-1519493966896-9c27a7e6f56a?auto=format&fit=crop&w=1600&q=82",imageAlt:"Travel view of New Orleans"},
{name:"Austin",country:"USA",vibes:["City","Culture","Nightlife"],transport:140,stay:480,tag:"Food + live music",emoji:"🎵",image:"https://www.airpartner.com/media/yfxporph/austin-texas-airport-guide-meta-1200-x-628.jpg",imageAlt:"Travel view of Austin",houstonLocal:true},
{name:"San Antonio",country:"USA",vibes:["Culture","City"],transport:150,stay:430,tag:"River Walk getaway",emoji:"🌮",image:"https://source.unsplash.com/1600x1000/?San%20Antonio%2C%20travel%2C%20landmark",imageAlt:"Travel view of San Antonio",houstonLocal:true},
{name:"Galveston",country:"USA",vibes:["Beach"],transport:80,stay:520,tag:"Easy Gulf escape",emoji:"🌊",image:"https://images.contentstack.io/v3/assets/blt00454ccee8f8fe6b/blta5940c1c753c36d2/6139e2fcaa183b2c785b5d71/US_Galveston_US_Header.jpg?auto=webp&quality=80&width=1680",imageAlt:"Travel view of Galveston",houstonLocal:true},
{name:"Corpus Christi",country:"USA",vibes:["Beach","Outdoors"],transport:190,stay:470,tag:"Coast + outdoors",emoji:"☀️",image:"https://source.unsplash.com/1600x1000/?Corpus%20Christi%2C%20travel%2C%20landmark",imageAlt:"Travel view of Corpus Christi",houstonLocal:true},
{name:"Fredericksburg",country:"USA",vibes:["Culture","Outdoors"],transport:180,stay:560,tag:"Hill Country escape",emoji:"🌿",image:"https://source.unsplash.com/1600x1000/?Fredericksburg%2C%20travel%2C%20landmark",imageAlt:"Travel view of Fredericksburg",houstonLocal:true},
{name:"Dallas",country:"USA",vibes:["City","Culture"],transport:180,stay:460,tag:"Food + city weekend",emoji:"🏙️",image:"https://source.unsplash.com/1600x1000/?Dallas%2C%20travel%2C%20landmark",imageAlt:"Travel view of Dallas",houstonLocal:true},
{name:"Lafayette",country:"USA",vibes:["Culture"],transport:170,stay:390,tag:"Cajun country",emoji:"⚜️",discovery:true,costLevel:"value",image:"https://source.unsplash.com/1600x1000/?Lafayette%2C%20travel%2C%20landmark",imageAlt:"Travel view of Lafayette"},
{name:"Hot Springs",country:"USA",vibes:["Outdoors","Culture"],transport:230,stay:430,tag:"Spa + mountain town",emoji:"♨️",discovery:true,costLevel:"value",image:"https://source.unsplash.com/1600x1000/?Hot%20Springs%2C%20travel%2C%20landmark",imageAlt:"Travel view of Hot Springs"},
{name:"Pensacola",country:"USA",vibes:["Beach"],transport:330,stay:570,tag:"White-sand Gulf",emoji:"🏖️",image:"https://source.unsplash.com/1600x1000/?Pensacola%2C%20travel%2C%20landmark",imageAlt:"Travel view of Pensacola"},
{name:"Kansas City",country:"USA",vibes:["City","Culture"],transport:330,stay:450,tag:"Barbecue + neighborhoods",emoji:"🎷",discovery:true,costLevel:"value",image:"https://source.unsplash.com/1600x1000/?Kansas%20City%2C%20travel%2C%20landmark",imageAlt:"Travel view of Kansas City"},
{name:"Memphis",country:"USA",vibes:["Culture","Nightlife"],transport:320,stay:420,tag:"Music + barbecue",emoji:"🎶",costLevel:"value",image:"https://source.unsplash.com/1600x1000/?Memphis%2C%20travel%2C%20landmark",imageAlt:"Travel view of Memphis"},
{name:"Tulum",country:"Mexico",vibes:["Beach","Culture"],transport:560,stay:620,tag:"Caribbean + ruins",emoji:"🌴",image:"https://source.unsplash.com/1600x1000/?Tulum%2C%20travel%2C%20landmark",imageAlt:"Travel view of Tulum"},
{name:"Mérida",country:"Mexico",vibes:["Culture","City"],transport:520,stay:430,tag:"Yucatán culture",emoji:"🌺",discovery:true,costLevel:"value",image:"https://source.unsplash.com/1600x1000/?M%C3%A9rida%2C%20travel%2C%20landmark",imageAlt:"Travel view of Mérida"},
{name:"Cancún",country:"Mexico",vibes:["Beach"],transport:520,stay:690,tag:"Caribbean escape",emoji:"🌴",image:"https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=1600&q=82",imageAlt:"Travel view of Cancún"},
{name:"Denver",country:"USA",vibes:["Adventure","City"],transport:410,stay:585,tag:"Mountains + city",emoji:"🏔️",image:"https://images.unsplash.com/photo-1619856699906-09e1f58c98b1?auto=format&fit=crop&w=1600&q=82",imageAlt:"Travel view of Denver"},
{name:"Big Bend",country:"USA",vibes:["Outdoors","Adventure"],transport:240,stay:520,tag:"Desert road trip",emoji:"🌵",image:"https://images.unsplash.com/photo-1592190057402-2bf1ee02118d?auto=format&fit=crop&w=1600&q=82",imageAlt:"Travel view of Big Bend"},
{name:"San Juan",country:"Puerto Rico",vibes:["Beach","Culture"],transport:650,stay:760,tag:"Island + old city",emoji:"🌊",image:"https://source.unsplash.com/1600x1000/?San%20Juan%2C%20travel%2C%20landmark",imageAlt:"Travel view of San Juan"},
{name:"Nashville",country:"USA",vibes:["Culture","Nightlife"],transport:365,stay:510,tag:"Music weekend",emoji:"🎸",image:"https://source.unsplash.com/1600x1000/?Nashville%2C%20travel%2C%20landmark",imageAlt:"Travel view of Nashville"},
{name:"Destin",country:"USA",vibes:["Beach"],transport:310,stay:760,tag:"Gulf beach",emoji:"☀️",image:"https://source.unsplash.com/1600x1000/?Destin%2C%20travel%2C%20landmark",imageAlt:"Travel view of Destin"},
{name:"Las Vegas",country:"USA",vibes:["Nightlife","City"],transport:390,stay:590,tag:"Entertainment",emoji:"🎲",image:"https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=82",imageAlt:"Travel view of Las Vegas"},
{name:"Mexico City",country:"Mexico",vibes:["Culture","City"],transport:490,stay:540,tag:"Food + design",emoji:"🌮",image:"https://source.unsplash.com/1600x1000/?Mexico%20City%2C%20travel%2C%20landmark",imageAlt:"Travel view of Mexico City"},
{name:"Guanacaste",country:"Costa Rica",vibes:["Beach","Adventure"],transport:720,stay:820,tag:"Beach + adventure",emoji:"🦥",image:"https://source.unsplash.com/1600x1000/?Guanacaste%2C%20travel%2C%20landmark",imageAlt:"Travel view of Guanacaste"},
{name:"San Diego",country:"USA",vibes:["Beach","City"],transport:520,stay:880,tag:"Coast + city",emoji:"🌅",image:"https://source.unsplash.com/1600x1000/?San%20Diego%2C%20travel%2C%20landmark",imageAlt:"Travel view of San Diego"},
{name:"Great Smoky Mountains",country:"USA",vibes:["Outdoors","Adventure"],transport:280,stay:690,tag:"Cabin + outdoors",emoji:"🌲",image:"https://source.unsplash.com/1600x1000/?Great%20Smoky%20Mountains%2C%20travel%2C%20landmark",imageAlt:"Travel view of Great Smoky Mountains"},
{name:"New York City",country:"USA",vibes:["City","Culture"],transport:560,stay:1120,tag:"Big city energy",emoji:"🗽",image:"https://source.unsplash.com/1600x1000/?New%20York%20City%2C%20travel%2C%20landmark",imageAlt:"Travel view of New York City"},
{name:"Chicago",country:"USA",vibes:["City","Culture"],transport:420,stay:720,tag:"Food + architecture",emoji:"🏙️",image:"https://images.unsplash.com/photo-1493134799591-2c9eed26201a?auto=format&fit=crop&w=1600&q=82",imageAlt:"Travel view of Chicago"},
{name:"Maui",country:"USA",vibes:["Beach","Adventure"],transport:1450,stay:1850,tag:"Hawaiian escape",emoji:"🌺",image:"https://source.unsplash.com/1600x1000/?Maui%2C%20travel%2C%20landmark",imageAlt:"Travel view of Maui"},
{name:"Aruba",country:"Aruba",vibes:["Beach"],transport:1180,stay:1760,tag:"One happy island",emoji:"🏝️",image:"https://source.unsplash.com/1600x1000/?Aruba%2C%20travel%2C%20landmark",imageAlt:"Travel view of Aruba"},
{name:"Belize",country:"Belize",vibes:["Beach","Adventure"],transport:980,stay:1420,tag:"Reef + rainforest",emoji:"🐠",image:"https://source.unsplash.com/1600x1000/?Belize%2C%20travel%2C%20landmark",imageAlt:"Travel view of Belize"},
{name:"Vancouver",country:"Canada",vibes:["City","Outdoors"],transport:920,stay:1380,tag:"City + wild coast",emoji:"🏔️",image:"https://source.unsplash.com/1600x1000/?Vancouver%2C%20travel%2C%20landmark",imageAlt:"Travel view of Vancouver"},
{name:"London",country:"United Kingdom",vibes:["City","Culture"],transport:1580,stay:1640,tag:"Classic city escape",emoji:"🇬🇧",image:"https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=82",imageAlt:"Travel view of London"},
{name:"Paris",country:"France",vibes:["City","Culture"],transport:1660,stay:1720,tag:"Food + iconic streets",emoji:"🇫🇷",image:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=82",imageAlt:"Travel view of Paris"},
{name:"Rome",country:"Italy",vibes:["Culture","City"],transport:1720,stay:1540,tag:"History + food",emoji:"🇮🇹",image:"https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=82",imageAlt:"Travel view of Rome"},
{name:"Reykjavík",country:"Iceland",vibes:["Adventure","Outdoors"],transport:1420,stay:1480,tag:"Fire + ice",emoji:"🇮🇸",image:"https://source.unsplash.com/1600x1000/?Reykjav%C3%ADk%2C%20travel%2C%20landmark",imageAlt:"Travel view of Reykjavík"},
{name:"Bora Bora",country:"French Polynesia",vibes:["Beach"],transport:4200,stay:6200,tag:"Overwater escape",emoji:"🌊",costLevel:"luxury",image:"https://source.unsplash.com/1600x1000/?Bora%20Bora%2C%20travel%2C%20landmark",imageAlt:"Travel view of Bora Bora"},
{name:"Maldives",country:"Maldives",vibes:["Beach"],transport:3900,stay:5900,tag:"Private island retreat",emoji:"🏝️",costLevel:"luxury",image:"https://source.unsplash.com/1600x1000/?Maldives%2C%20travel%2C%20landmark",imageAlt:"Travel view of Maldives"},
{name:"Tokyo",country:"Japan",vibes:["City","Culture"],transport:2400,stay:2500,tag:"Food + discovery",emoji:"🗼",image:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=82",imageAlt:"Travel view of Tokyo"},
{name:"Amalfi Coast",country:"Italy",vibes:["Beach","Culture"],transport:2500,stay:3900,tag:"Italian coast",emoji:"🍋",image:"https://source.unsplash.com/1600x1000/?Amalfi%20Coast%2C%20travel%2C%20landmark",imageAlt:"Travel view of Amalfi Coast"},
{name:"Swiss Alps",country:"Switzerland",vibes:["Outdoors","Adventure"],transport:2600,stay:4100,tag:"Alpine escape",emoji:"🏔️",costLevel:"premium",image:"https://source.unsplash.com/1600x1000/?Swiss%20Alps%2C%20travel%2C%20landmark",imageAlt:"Travel view of Swiss Alps"},
{name:"Madeira",country:"Portugal",vibes:["Outdoors","Adventure"],transport:1750,stay:1320,tag:"Atlantic island escape",emoji:"🌿",discovery:true,image:"https://source.unsplash.com/1600x1000/?Madeira%2C%20travel%2C%20landmark",imageAlt:"Travel view of Madeira"},
{name:"São Miguel",country:"Azores, Portugal",vibes:["Outdoors","Adventure"],transport:1680,stay:1180,tag:"Volcanic island",emoji:"🌋",discovery:true,image:"https://source.unsplash.com/1600x1000/?S%C3%A3o%20Miguel%2C%20travel%2C%20landmark",imageAlt:"Travel view of São Miguel"},
{name:"Ljubljana",country:"Slovenia",vibes:["Culture","Outdoors"],transport:1820,stay:980,tag:"Alps + old town",emoji:"🏞️",discovery:true,image:"https://source.unsplash.com/1600x1000/?Ljubljana%2C%20travel%2C%20landmark",imageAlt:"Travel view of Ljubljana"},
{name:"Cartagena",country:"Colombia",vibes:["Beach","Culture"],transport:980,stay:1050,tag:"Caribbean color",emoji:"🌺",discovery:true,image:"https://source.unsplash.com/1600x1000/?Cartagena%2C%20travel%2C%20landmark",imageAlt:"Travel view of Cartagena"},
{name:"Antigua",country:"Guatemala",vibes:["Culture","Adventure"],transport:760,stay:820,tag:"Volcano + colonial city",emoji:"🌋",discovery:true,image:"https://source.unsplash.com/1600x1000/?Antigua%2C%20travel%2C%20landmark",imageAlt:"Travel view of Antigua"},
{name:"Québec City",country:"Canada",vibes:["Culture","City"],transport:980,stay:1120,tag:"Old-world weekend",emoji:"🏰",discovery:true,image:"https://source.unsplash.com/1600x1000/?Qu%C3%A9bec%20City%2C%20travel%2C%20landmark",imageAlt:"Travel view of Québec City"},
{name:"Curaçao",country:"Curaçao",vibes:["Beach","Culture"],transport:1280,stay:1480,tag:"Colorful Caribbean",emoji:"🐚",discovery:true,image:"https://source.unsplash.com/1600x1000/?Cura%C3%A7ao%2C%20travel%2C%20landmark",imageAlt:"Travel view of Curaçao"},
{name:"Oaxaca",country:"Mexico",vibes:["Culture","City"],transport:820,stay:720,tag:"Food + mezcal country",emoji:"🌵",discovery:true,costLevel:"value",image:"https://source.unsplash.com/1600x1000/?Oaxaca%2C%20travel%2C%20landmark",imageAlt:"Travel view of Oaxaca"}
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
   provider:"demo",kind:"stay",destination:d.name,
   amount:Math.round(d.stay*(search.days/4)*Math.max(1,Math.ceil(search.travelers/2)*.88)),
   currency:"USD",live:false
  } satisfies InventoryQuote));
 }
};
export function onTripCosts(profile:DestinationProfile){
 const level=profile.costLevel??"standard";
 if(level==="value")return {foodPerPersonDay:42,localPerDay:28,activitiesPerPersonDay:36,bufferRate:.08};
 if(level==="premium")return {foodPerPersonDay:78,localPerDay:58,activitiesPerPersonDay:70,bufferRate:.1};
 if(level==="luxury")return {foodPerPersonDay:115,localPerDay:85,activitiesPerPersonDay:110,bufferRate:.12};
 return {foodPerPersonDay:55,localPerDay:38,activitiesPerPersonDay:45,bufferRate:.08};
}
