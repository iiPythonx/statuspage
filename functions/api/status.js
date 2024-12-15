// Copyright (c) 2024 iiPython

export async function onRequestGet(context) {
    try {
        return new Response(JSON.stringify({
            urls: JSON.parse(await context.env.statuspage_data.get("urls", { cacheTtl: 86400 })),
            records: JSON.parse(await context.env.statuspage_data.get("records", { cacheTtl: 3600 }))
        }));
    } catch (e) {
        console.error(e);
        return new Response("{}", { status: 500 });
    }
}