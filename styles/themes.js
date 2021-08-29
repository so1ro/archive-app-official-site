import { extendTheme } from "@chakra-ui/react"
import { text_color } from '@/styles/colorModeValue'
import { createBreakpoints } from "@chakra-ui/theme-tools"

const breakpoints = createBreakpoints({
    sm: "480px",
    md: "768px",
    lg: "992px",
    xl: "1280px",
    "2xl": "1480px",
    "3xl": "1536px",
    "4xl": "1680px",
})

const theme = extendTheme({
    breakpoints,
    initialColorMode: "light",
    useSystemColorMode: false,
    fontWeights: {
        hairline: 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
    },
    styles: {
        global: (props) => ({
            html: {
                scrollBehavior: "smooth",
            },
            body: {
                // background: props.colorMode === "dark" ? "#1D2932" : "#edf2f7",
                color: props.colorMode === "dark" ? text_color.d : text_color.l,
                padding: 0,
                margin: 0,
                overflowY: "scroll",
            },
            "a": {
                color: "inherit",
                textDecoration: "none"
            },
            "a.active": {
                color: props.colorMode === "dark" ? "#f57056" : "#f57056",
            },
            "a:hover": {
                textDecoration: "none!important",
            },
            "div.english_container": {
                fontFamily: "Merriweather",
                letterSpacing: 1.2,
            },
            "div.japanese_container": {
                fontFamily: "Noto Serif JP",
            },
            ".logo": {
                fontFamily: "Sacramento",
            },
            // "*:focus": {
            //     boxShadow: "none!important" // Delete Blue border from all clickable elements
            // }
        }),
    },
});

export default theme;

//// FontSize Basic /////
// fontSize={{ base: 'md', lg: 'xl' }}