import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

let lastProcessedTimestamp = 0;
const cooldownPeriod = 5000;

export async function POST(req: Request) {
  const currentTimestamp = Date.now();
  if (currentTimestamp - lastProcessedTimestamp < cooldownPeriod) {
    return new Response("Rate limit exceeded", { status: 429 });
  }
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type

  const eventType = evt.type;

  if (eventType === "user.created") {
    await db.user.create({
      data: {
        externalUserId: payload.data.id,
        username: payload.data.username,
        avatar: payload.data.image_url,
        email: payload.data?.email_addresses[0]?.email_address,
      },
    });
    revalidatePath("/");
    revalidatePath(`/user/${payload.data?.username}`);
  }

  if (eventType === "user.updated") {
    await db.user.update({
      where: {
        externalUserId: payload.data.id,
      },
      data: {
        username: payload.data.username,
        avatar: payload.data.image_url,
      },
    });
  }

  if (eventType === "user.deleted") {
    const deletedUser = await db.user.delete({
      where: {
        externalUserId: payload.data.id,
      },
    });

    await db.conversation.deleteMany({
      where: {
        userIds: {
          has: deletedUser.id,
        },
      },
    });
  }

  return new Response("", { status: 200 });
}
