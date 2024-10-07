interface artworkData {
    id: number;
    banner: string;
    alt: string;
    title: string;
    description: string;
}

export const artworks: artworkData[] = [
    {
        id:1,
        banner: "/images/raiden-shogun/raiden-banner.png",
        alt: "drawing of raiden shogun",
        title: "raiden shogun",
        description: "Raiden Shogun has long been my favourite character in Genshin Impact, and I wanted to capture her energy in a composition that was inspired by the League of Legends splash art styles. Taking on one of the biggest digital canvases I've ever worked on was both exciting and challenging - the compressed PNG in the end ended up being 81MB and my iPad crashed a couple times! I aimed for a high level of detail, but this had to be balanced with maintaining a good overall composition and keeping a solid bigger picture."
    },

    {
        id:2,
        banner: "/images/raven/raven-banner.png",
        alt: "drawing of raven",
        title: "raven",
        description: "I joined a \"Draw This In Your Style Challenge\" for Raven, a character designed by another artist on Instagram. This project was a great learning experience, especially for drawing metal, which I drew great inspiration from WLOP's works. This piece also allowed me to work on drawing backgrounds further, especially after drawing Raiden Shogun. I was very happy to be featured on the front of the artist's post at the end of the challenge!"
    }

]