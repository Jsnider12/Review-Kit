import "./globals.css";

export const metadata={
  title:"Roamwithin — See where your budget can take you",
  description:"Start with what you want to spend and discover complete vacations built around your total trip budget.",
  robots:{index:false,follow:false},
  openGraph:{
    title:"Roamwithin — See where your budget can take you",
    description:"Flights, stays and on-trip spending considered together around one number.",
    type:"website"
  }
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}
