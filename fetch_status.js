// Copyright (c) 2024 iiPython

const services = [
    { expect: 404, name: "iiPython Front Page", url: "https://iipython.dev" },
    { expect: 404, name: "Geesecraft Archives", url: "https://gc.iipython.dev" },
    { expect: 404, name: "Public CDN", url: "https://cdn.iipython.dev" },
    { expect: 301, name: "Consumet API", url: "https://anisq.iipython.dev" },
    { expect: 404, name: "File Sharing", url: "https://files.iipython.dev" },
    { expect: 404, name: "Local Network", url: "https://lan.iipython.dev" },
    { expect: 404, name: "Codelet", url: "https://codelet.codes" },
    { expect: 404, name: "Inventory Service", url: "https://inv.codelet.codes" },
];

async function fetch_status() {
    const slice = { time: Date.now() / 1000 | 0, services: {} };
    for (let { expect, name, url } of services) {

        // Make request
        const control = new AbortController();
        const timeout = setTimeout(control.abort, 10000);

        try {
            const start = performance.now()
            const up = (await fetch(`${url}/_statuscheck/${slice.time}`, { redirect: "manual" })).status === expect;
            clearTimeout(timeout);
            slice.services[name] = up ? Math.round(performance.now() - start) : 0;

        } catch { slice.services[name] = 0; }
    }
    return slice;
}

export default {
    async scheduled(_, env, ctx) {
        ctx.waitUntil((async () => {
            await env.statuspage_data.put("urls", JSON.stringify(services));

            // Handle existing data
            let records = JSON.parse(await env.statuspage_data.get("records")) || [];
            if (records.length === 48) records = records.slice(1);

            // Go fetch status information
            records.push(await fetch_status());

            // Save new data
            await env.statuspage_data.put("records", JSON.stringify(records));
        })());
    }
}