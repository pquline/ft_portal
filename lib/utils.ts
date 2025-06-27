import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sendDiscordErrorNotification(errorMessage?: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL_ERROR;

  if (!webhookUrl) {
    console.error("Discord webhook URL not configured");
    return;
  }

  const embed = {
    title: "⚠️ **ft_portal** ⚠️",
    color: 0xFF0000,
    description: "An error occurred with the access token.",
    fields: [] as Array<{
      name: string;
      value: string;
      inline: boolean;
    }>,
  };

  if (errorMessage) {
    embed.fields.push({
      name: "Error Details",
      value: errorMessage,
      inline: false
    });
  }

  const payload = { embeds: [embed] };
  const headers = { "Content-Type": "application/json" };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (response.status !== 204) {
      console.error(`Failed to send error notification. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to send error notification:", error);
  }
}
