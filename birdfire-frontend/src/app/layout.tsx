import "./globals.css"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BirdFire Furniture | Modern Furniture for Outdoor Living",
  description: "Buy modern furniture online at BirdFire. Stylish, durable, and thoughtfully designed pieces for Outdoor Living.",
   icons: {
    icon: "/favicon.png",
  },
};


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/material-design-iconic-font@2.2.0/dist/css/material-design-iconic-font.min.css"
                />
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/material-design-iconic-font@2.2.0/dist/css/material-design-iconic-font.min.css"
                />

            </head>
            <body>
                {children}
            </body>
        </html>
    )
}
