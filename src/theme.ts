import { extendTheme } from "@chakra-ui/react";

const common = {
  fonts: {
    body: "Inter",
    heading: "Inter, sans-serif",
    mono: "Menlo, monospace",
    logo: "Abril Fatface",
  },

  styles: {
    global: {
      body: {
        bg: "paper",
      },
    },
  },

  components: {
    Text: {
      variants: {
        subtitle: {
          color: "gray.600",
          fontWeight: "bold",
          "font-variant": "all-petite-caps",
        },
      },
    },

    Link: {
      variants: {
        navItem: {
          my: 2,
          py: 3,
          fontSize: ".75em",
          fontWeight: 500,
          boxShadow: "none !important",
          display: "flex",
          _activeLink: {
            position: "relative",
            backgroundColor: "highlight",
          },
        },
      },
    },

    Box: {
      variants: {
        content: {
          backgroundColor: "front",
          borderRadius: "xl",
        },
      },
    },
  },
};

const theme = extendTheme({
  ...common,

  colors: {
    paper: "#fafafe",
    front: "#ffffff",
    highlight: "rgba(0,0,0,0.05)",
    primary: {
      50: "hsl(142deg, 100%, 85%)",
      100: "hsl(142deg, 100%, 80%)",
      200: "hsl(142deg, 100%, 70%)",
      300: "hsl(142deg, 100%, 65%)",
      400: "hsl(142deg, 100%, 50%)",
      500: "hsl(142deg, 100%, 45%)",
      600: "hsl(142deg, 100%, 40%)",
      700: "hsl(142deg, 100%, 30%)",
      800: "hsl(142deg, 100%, 20%)",
    },
  },
});

export default theme;
