// root.tsx
import { ChakraProvider, Box, Heading } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from "@remix-run/react";
import { extendTheme } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import { Menu } from "./menuStyling";
import stylesSlick from "slick-carousel/slick/slick.css";
import stylesSlickTheme from "slick-carousel/slick/slick-theme.css";
import global from "../app/styles/global.css";
const theme = extendTheme({
  fonts: {
    body: `'Hind'`,
  },
  components: {
    Menu,
  },
});

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

function Document({ children, title = "App title" }: { children: React.ReactNode; title?: string }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  // throw new Error("💣💥 Booooom");

  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Navbar />
        <Outlet />
      </ChakraProvider>
    </Document>
  );
}

// How ChakraProvider should be used on CatchBoundary
export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <ChakraProvider>
        <Box>
          <Heading as="h1" bg="purple.600">
            [CatchBoundary]: {caught.status} {caught.statusText}
          </Heading>
        </Box>
      </ChakraProvider>
    </Document>
  );
}

// How ChakraProvider should be used on ErrorBoundary
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <ChakraProvider>
        <Box>
          <Heading as="h1" bg="blue.500">
            [ErrorBoundary]: There was an error: {error.message}
          </Heading>
        </Box>
      </ChakraProvider>
    </Document>
  );
}
export function links() {
  return [
    { rel: "stylesheet", href: stylesSlick },
    { rel: "stylesheet", href: stylesSlickTheme },
    { rel: "stylesheet", href: global },
  ];
}
