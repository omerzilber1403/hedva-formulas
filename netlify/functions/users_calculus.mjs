import { getStore } from "@netlify/blobs";

/**
 * Enhanced Netlify Serverless Function for Calculus 2 Formulas Pro App
 * 
 * Supported Actions (via POST body):
 * - "register": Create new user with username + PIN
 * - "login": Authenticate user with username + PIN
 * - "sync": Update user data (statuses, highScore, quizzesTaken)
 * - "getAll": Retrieve all users (for testing/admin)
 * 
 * Data Structure per user:
 * {
 *   name: string,
 *   pin: string,              // Store hashed PIN in production!
 *   statuses: {},             // flashcard question statuses (red/yellow/green)
 *   highScore: number,        // highest test score achieved
 *   quizzesTaken: number      // total number of quizzes completed
 * }
 */

export default async (req) => {
    const store = getStore("quiz_profiles");

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("OK", { headers });
    }

    // GET: Return all users (without PINs for security)
    if (req.method === "GET") {
        try {
            const users = await store.get("all_users", { type: "json" }) || {};
            
            // Strip PINs from response for security
            const safeUsers = {};
            for (const [username, userData] of Object.entries(users)) {
                safeUsers[username] = {
                    name: userData.name,
                    statuses: userData.statuses,
                    highScore: userData.highScore || 0,
                    quizzesTaken: userData.quizzesTaken || 0
                    // PIN intentionally omitted
                };
            }
            
            return new Response(JSON.stringify(safeUsers), { headers, status: 200 });
        } catch (err) {
            console.error("GET Error:", err);
            return new Response(JSON.stringify({}), { headers, status: 200 });
        }
    }

    // POST: Handle action-based routing
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

            // Load existing users from blob storage
            const users = await store.get("all_users", { type: "json" }) || {};

            // ==================== REGISTER ====================
            if (action === "register") {
                if (!name || !pin) {
                    return new Response(JSON.stringify({ error: "Missing name or PIN" }), { 
                        status: 400, 
                        headers 
                    });
                }

                // Check if user already exists
                if (users[name]) {
                    return new Response(JSON.stringify({ error: "User already exists" }), { 
                        status: 409, 
                        headers 
                    });
                }

                // Create new user with default values
                users[name] = {
                    name,
                    pin,  // NOTE: In production, hash this with bcrypt or similar!
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

                // Validate PIN (in production, use bcrypt.compare!)
                if (users[name].pin !== pin) {
                    return new Response(JSON.stringify({ error: "Incorrect PIN" }), { 
                        status: 401, 
                        headers 
                    });
                }

                // Successful login - return user data without PIN
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

                // Update user data (preserve PIN, only update provided fields)
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
                        name: users[name].name,
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
                        statuses: userData.statuses,
                        highScore: userData.highScore || 0,
                        quizzesTaken: userData.quizzesTaken || 0
                        // PIN intentionally omitted
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
