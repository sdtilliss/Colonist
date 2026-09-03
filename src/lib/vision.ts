import Anthropic from "@anthropic-ai/sdk";

export interface ParsedPlayer {
  rawName: string;
  victoryPoints: number;
}

export interface ParsedGame {
  players: ParsedPlayer[];
  winnerRawName: string;
}

interface ImageInput {
  base64: string;
  mediaType: "image/png" | "image/jpeg" | "image/webp";
}

const PROMPT = `These are one or two screenshots of the same finished game of Catan from Colonist.io. \
Each screenshot shows a post-game results screen (an "Overview" tab, and/or a more detailed \
stats tab) listing every player and their final total victory points.

A row can sometimes be partially covered by a popup or card overlay in one screenshot — if a \
second screenshot is provided, use it to fill in or double check anything obscured in the first. \
Treat both screenshots as views of the exact same single game, not two different games — return \
one merged, de-duplicated list of players.

Extract every player's exact displayed name (including any # tag, e.g. "Osborn#6358") and their \
final total victory point count (the number next to the trophy icon, not dice/resource/dev-card \
stats). Identify the winner as the player with the highest victory point total.`;

export async function parseGameScreenshots(images: ImageInput[]): Promise<ParsedGame> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local to use AI screenshot parsing."
    );
  }

  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    tools: [
      {
        name: "report_game_result",
        description: "Report the parsed players and winner from a Colonist.io end-of-game screen.",
        input_schema: {
          type: "object",
          properties: {
            players: {
              type: "array",
              description: "Every player in the game with their final victory point total.",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Exact displayed name, including any # tag." },
                  victoryPoints: { type: "number", description: "Final total victory points." },
                },
                required: ["name", "victoryPoints"],
              },
            },
            winnerName: {
              type: "string",
              description: "The exact displayed name of the player with the highest victory points.",
            },
          },
          required: ["players", "winnerName"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "report_game_result" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: PROMPT },
          ...images.map(
            (img) =>
              ({
                type: "image",
                source: { type: "base64", media_type: img.mediaType, data: img.base64 },
              }) as const
          ),
        ],
      },
    ],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a structured result. Try again with clearer screenshots.");
  }

  const input = toolUse.input as { players: { name: string; victoryPoints: number }[]; winnerName: string };

  if (!input.players?.length || !input.winnerName) {
    throw new Error("Couldn't find any players in those screenshots. Try again with clearer screenshots.");
  }

  return {
    players: input.players.map((p) => ({ rawName: p.name, victoryPoints: p.victoryPoints })),
    winnerRawName: input.winnerName,
  };
}
