import { artworks } from "@/app/recents/[id]/artworks";
import RecentClient from './clientside';

export function generateStaticParams() {
    return artworks.map(artwork => ({
        id: artwork.id.toString(),
    }));
}

export default function RecentPage() {
    return <RecentClient />;
}
