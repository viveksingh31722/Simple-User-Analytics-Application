import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "CausalFunnel Analytics Dashboard",
  description: "Gain complete insight into e-commerce user sessions, complete user journeys, and highly responsive interaction heatmaps.",
  keywords: "Analytics, Session Tracking, User Journey, Heatmap, E-commerce Behavior",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}

