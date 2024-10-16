import { artworks } from "@/app/recents/[id]/artworks";

export async function generateStaticParams() {
    const paths = artworks.map((artwork) => ({
        id: artwork.id.toString(),
    }));

    return paths;
}