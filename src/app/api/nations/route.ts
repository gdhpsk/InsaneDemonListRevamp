import cache from "../../../../cache.json"

export async function GET(request: Request) {
    let nationalities = cache.nationalities
    return new Response(JSON.stringify(nationalities), {
        status: 200
    })
}

export const revalidate = 600