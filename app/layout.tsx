import "./globals.css";
export const metadata = {
  title: "Review Kit",
  description: "Create a personalized Google review kit for your business.",
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
