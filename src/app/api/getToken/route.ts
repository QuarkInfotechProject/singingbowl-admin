import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const API_SECRET = process.env.API_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await req.json();
  if (!body.nonce || !body.timestamp || !body.signature) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { nonce, timestamp, signature } = body;
  const expectedSignature = crypto
    .createHmac("sha256", API_SECRET)
    .update(`${nonce}${timestamp}`)
    .digest("hex");

  if (signature !== expectedSignature || Date.now() - timestamp > 30000) {
    return NextResponse.json(
      { error: "Invalid signature or expired request" },
      { status: 403 }
    );
  }

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  console.log("🔑 Token found, fetching CSRF token...");

  try {
    const baseUrl = BASE_URL.replace(/\/api\/admin$/, "");
    const csrfUrl = `${baseUrl}/sanctum/csrf-cookie`;

    console.log("📡 Calling CSRF URL:", csrfUrl);

    const csrfResponse = await fetch(csrfUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.log("📥 CSRF Response Status:", csrfResponse.status);

    let csrfToken = null;

    if (csrfResponse.ok || csrfResponse.status === 204) {
      const setCookieHeader = csrfResponse.headers.get("set-cookie");
      console.log("🍪 Set-Cookie header present:", !!setCookieHeader);

      if (setCookieHeader) {
        const cookies = setCookieHeader.split(",").map((c) => c.trim());

        for (const cookie of cookies) {
          const match = cookie.match(/XSRF-TOKEN=([^;]+)/);
          if (match) {
            // DON'T decode - send it as-is
            csrfToken = match[1];
            console.log("✅ CSRF token extracted (encoded)");
            console.log("Token preview:", csrfToken.substring(0, 30) + "...");
            break;
          }
        }
      }

      if (
        !csrfToken &&
        typeof csrfResponse.headers.getSetCookie === "function"
      ) {
        const setCookies = csrfResponse.headers.getSetCookie();

        for (const cookie of setCookies) {
          const match = cookie.match(/XSRF-TOKEN=([^;]+)/);
          if (match) {
            // DON'T decode - send it as-is
            csrfToken = match[1];
            console.log("✅ CSRF token extracted from array (encoded)");
            break;
          }
        }
      }

      if (!csrfToken) {
        console.warn("⚠️ No CSRF token found in response headers");
      }
    } else {
      const errorText = await csrfResponse.text();
      console.error(
        "❌ Failed to fetch CSRF cookie:",
        csrfResponse.status,
        errorText
      );
    }

    console.log("🎯 Final CSRF token:", csrfToken ? "Present" : "NULL");

    return NextResponse.json(
      {
        token,
        csrfToken: csrfToken ? decodeURIComponent(csrfToken) : null, // Decode here for sending
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("💥 Error fetching CSRF token:", error);
    return NextResponse.json(
      {
        token,
        csrfToken: null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
