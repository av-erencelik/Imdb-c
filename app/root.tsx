// root.tsx
import { ChakraProvider, Box, Heading, Link } from "@chakra-ui/react";
import { json, type MetaFunction, type Request } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch, useLoaderData } from "@remix-run/react";
import { extendTheme } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import { Menu } from "./menuStyling";
import stylesSlick from "slick-carousel/slick/slick.css";
import stylesSlickTheme from "slick-carousel/slick/slick-theme.css";
import global from "../app/styles/global.css";
import Footer from "./components/Footer";

import { GlobalLoading } from "./components/GlobalProgress";
import { getUserInfos } from "./auth.server";
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
  const { user } = useLoaderData();
  return (
    <Document>
      <ChakraProvider theme={theme}>
        <GlobalLoading />
        <Navbar user={user} />
        <Outlet />
        <Footer />
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
        <GlobalLoading />
        <Box
          h={"100vh"}
          bg="yellow.400"
          display={"flex"}
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="7"
        >
          <Box>
            <Heading as="h1" display="block">
              {caught.status} {caught.data}
            </Heading>
          </Box>

          <Box>
            <Heading as="h2" display="block" fontSize="xl">
              Something Happened!
            </Heading>
          </Box>
          <Link href="/home" bg="gray.700" color="yellow.400" px="2" py="1" borderRadius="lg">
            Back To Home
          </Link>
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
export async function loader({ request }: { request: Request }) {
  const user = await getUserInfos(request);
  return json({ user });
}
