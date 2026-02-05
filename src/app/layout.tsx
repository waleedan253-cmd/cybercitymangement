// import { ConfigProvider, theme } from "antd";
// import type { Metadata } from "next";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "CyberCity - Laptop Management",
//   description: "Modern laptop inventory management system",
//   viewport: "width=device-width, initial-scale=1",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <ConfigProvider
//           theme={{
//             algorithm: theme.darkAlgorithm,
//             token: {
//               colorPrimary: "#00f0ff",
//               colorSuccess: "#06ffa5",
//               colorWarning: "#ffbe0b",
//               colorError: "#ff006e",
//               colorInfo: "#8338ec",
//               colorBgContainer: "rgba(15, 23, 42, 0.8)",
//               colorBgElevated: "rgba(10, 14, 39, 0.9)",
//               colorBorder: "rgba(0, 240, 255, 0.2)",
//               borderRadius: 8,
//               fontFamily: "'Rajdhani', sans-serif",
//               fontSize: 16,
//             },
//             components: {
//               Button: {
//                 primaryShadow: "0 0 20px rgba(0, 240, 255, 0.5)",
//                 controlHeight: 42,
//                 fontWeight: 600,
//               },
//               Card: {
//                 borderRadiusLG: 12,
//               },
//               Input: {
//                 controlHeight: 42,
//               },
//               Select: {
//                 controlHeight: 42,
//               },
//             },
//           }}
//         >
//           <div className="cyber-grid" />
//           {children}
//         </ConfigProvider>
//       </body>
//     </html>
//   );
// }
import { ConfigProvider, theme, App } from "antd"; // Add App to imports
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberCity - Laptop Management",
  description: "Modern laptop inventory management system",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: "#00f0ff",
              colorSuccess: "#06ffa5",
              colorWarning: "#ffbe0b",
              colorError: "#ff006e",
              colorInfo: "#8338ec",
              colorBgContainer: "rgba(15, 23, 42, 0.8)",
              colorBgElevated: "rgba(10, 14, 39, 0.9)",
              colorBorder: "rgba(0, 240, 255, 0.2)",
              borderRadius: 8,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 16,
            },
            components: {
              Button: {
                primaryShadow: "0 0 20px rgba(0, 240, 255, 0.5)",
                controlHeight: 42,
                fontWeight: 600,
              },
              Card: {
                borderRadiusLG: 12,
              },
              Input: {
                controlHeight: 42,
              },
              Select: {
                controlHeight: 42,
              },
            },
          }}
        >
          <App>
            <div className="cyber-grid" />
            {children}
          </App>
        </ConfigProvider>
      </body>
    </html>
  );
}
