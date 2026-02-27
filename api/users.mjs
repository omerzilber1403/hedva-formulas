import { getStore } from "@netlify/blobs";

/**
 * Hedva Formulas Backend - Calculus 2 Learning App
 * 
 * Expected Body for POST:
 * {
 *   "action": "register" | "login" | "sync" | "getAll",
 *   "name": "username",
 *   "pin": "1234" (for register/login),
 *   "statuses": {} (for sync),
 *   "highScore": 0 (for sync, optional),
 *   "quizzesTaken": 0 (for sync, optional)
 * }
 * 
 * Data Structure:
 * {
 *   "username": {
 *     "name": "username",
 *     "pin": "1234",
 *     "statuses": {},
 *     "highScore": 0,
 *     "quizzesTaken": 0
 *   }
 * }
 */

export default async (req) => {
    const store = getStore("hedva_formulas_users");

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    // CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("OK", { headers });
    }

    // GET: Return all users (WITHOUT pins, only user data)
    if (req.method === "GET") {
        try {
            const users = await store.get("all_users", { type: "json" }) || {};
            
            // Strip PINs and format response
            const safeUsers = {};
            for (const [username, userData] of Object.entries(users)) {
                safeUsers[username] = {
                    name: userData.name,
                    statuses: userData.statuses || {},
                    highScore: userData.highScore || 0,
                    quizzesTaken: userData.quizzesTaken || 0
                };
            }
            
            return new Response(JSON.stringify(safeUsers), { headers, status: 200 });
        } catch (err) {
            console.error("GET Error:", err);
            return new Response(JSON.stringify({}), { headers, status: 200 });
        }
    }

    // POST: Handle actions
    if (req.method === "POST") {
        try {
            const body = await req.json();
            const { action, name, pin, statuses, highScore, quizzesTaken } = body;

            if (!action) {
                return new Response(JSON.stringify({ error: "Missing 'action' field" }), { 
                    status: 400, 
                    headers 
                });
            }

            // Load existing users
            const users = await store.get("all_users", { type: "json" }) || {};

            // ==================== REGISTER ====================
            if (action === "register") {
                if (!name || !pin) {
                    return new Response(JSON.stringify({ error: "Missing name or PIN" }), { 
                        status: 400, 
                        headers 
                    });
                }

                // Check if user exists
                if (users[name]) {
                    return new Response(JSON.stringify({ error: "User already exists" }), { 
                        status: 409, 
                        headers 
                    });
                }

                // Create new user
                users[name] = {
                    name,
                    pin, // TODO: Hash in production!
                    statuses: {},
                    highScore: 0,
                    quizzesTaken: 0
                };

                await store.setJSON("all_users", users);

                return new Response(JSON.stringify({ 
                    success: true, 
                    message: "User registered successfully",
                    user: {
                        name: users[name].name,
                        statuses: users[name].statuses,
                        highScore: users[name].highScore,
                        quizzesTaken: users[name].quizzesTaken
                    }
                }), { headers, status: 201 });
            }

            // ==================== LOGIN ====================
            if (action === "login") {
                if (!name || !pin) {
                    return new Response(JSON.stringify({ error: "Missing name or PIN" }), { 
                        status: 400, 
                        headers 
                    });
                }

                // Check if user exists
                if (!users[name]) {
                    return new Response(JSON.stringify({ error: "User not found" }), { 
                        status: 404, 
                        headers 
                    });
                }

                // Validate PIN
                if (users[name].pin !== pin) {
                    return new Response(JSON.stringify({ error: "Incorrect PIN" }), { 
                        status: 401, 
                        headers 
                    });
                }

                // Successful login
                return new Response(JSON.stringify({ 
                    success: true,
                    message: "Login successful",
                    user: {
                        name: users[name].name,
                        statuses: users[name].statuses || {},
                        highScore: users[name].highScore || 0,
                        quizzesTaken: users[name].quizzesTaken || 0
                    }
                }), { headers, status: 200 });
            }

            // ==================== SYNC ====================
            if (action === "sync") {
                if (!name) {
                    return new Response(JSON.stringify({ error: "Missing name" }), { 
                        status: 400, 
                        headers 
                    });
                }

                // Check if user exists
                if (!users[name]) {
                    return new Response(JSON.stringify({ error: "User not found" }), { 
                        status: 404, 
                        headers 
                    });
                }

                // Update user data
                if (statuses !== undefined) {
                    users[name].statuses = statuses;
                }
                if (highScore !== undefined) {
                    users[name].highScore = highScore;
                }
                if (quizzesTaken !== undefined) {
                    users[name].quizzesTaken = quizzesTaken;
                }

                await store.setJSON("all_users", users);

                return new Response(JSON.stringify({ 
                    success: true,
                    message: "Data synced successfully",
                    user: {
                        statuses: users[name].statuses,
                        highScore: users[name].highScore,
                        quizzesTaken: users[name].quizzesTaken
                    }
                }), { headers, status: 200 });
            }

            // ==================== GET ALL (for admin/testing) ====================
            if (action === "getAll") {
                const safeUsers = {};
                for (const [username, userData] of Object.entries(users)) {
                    safeUsers[username] = {
                        name: userData.name,
                        statuses: userData.statuses || {},
                        highScore: userData.highScore || 0,
                        quizzesTaken: userData.quizzesTaken || 0
                    };
                }
                
                return new Response(JSON.stringify(safeUsers), { headers, status: 200 });
            }

            // Unknown action
            return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), { 
                status: 400, 
                headers 
            });

        } catch (err) {
            console.error("POST Error:", err);
            return new Response(JSON.stringify({ error: err.message }), { 
                status: 500, 
                headers 
            });
        }
    }

    // Method not allowed
    return new Response("Method Not Allowed", { status: 405, headers });
};

export const config = {
    path: "/api/users"
};
