export function generateStaticParams() {
    return [
        { id: '1' },  // Version for /recents/1
        { id: '2' },  // Version for /recents/2
    ];
}

// Export a default function for the server component
export default function PageServer({ params }: { params: { id: string } }) {
    const { id } = params;

    return (
        <div>
            <h1>Static Details for Item {id}</h1>
            {/* You can also include additional content for server-rendered pages */}
        </div>
    );
}
