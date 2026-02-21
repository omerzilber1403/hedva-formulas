import { getStore } from "@netlify/blobs";

export default async (req) => {
    const store = getStore("quiz_profiles");

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    if (req.method === "OPTIONS") return new Response("OK", { headers });

    if (req.method === "GET") {
        try {
            const users = await store.get("all_users", { type: "json" }) || {};
            return new Response(JSON.stringify(users), { headers, status: 200 });
        } catch (err) {
            return new Response(JSON.stringify({}), { headers, status: 200 }); // Fail gracefully
        }
    }

    if (req.method === "POST") {
        try {
            const { name, statuses } = await req.json();
            if (!name) return new Response("Missing name", { status: 400, headers });

            const users = await store.get("all_users", { type: "json" }) || {};
            users[name] = { name, statuses };
            await store.setJSON("all_users", users);

            return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
        }
    }

    return new Response("Not Allowed", { status: 405, headers });
};

export const config = {
    path: "/api/users"
};
