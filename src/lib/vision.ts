import Anthropic from "@anthropic-ai/sdk";

export interface ParsedPlayer {
  rawName: string;
  victoryPoints: number;
  devCardsBought?: number;
  trades?: number;
}

export interface ParsedGame {
  players: ParsedPlayer[];
  winnerRawName: string;
}

interface ImageInput {
  base64: string;
  mediaType: "image/png" | "image/jpeg" | "image/webp";
}

const PROMPT = `These are one or two screenshots of the same finished game of Catan from Colonist.io.

The first screenshot is the post-game "Overview" tab, listing every player and their final total
victory points.

If a second screenshot is provided, it's a different stats tab from the same completed game
(e.g. Dice Stats or Activity Stats) with extra per-player columns. A row can sometimes be
partially covered by a popup or card overlay in one screenshot — use the other to fill in or
double check anything obscured. Treat both screenshots as views of the exact same single game,
not two different games — return one merged, de-duplicated list of players, matched by their
exact displayed name/tag.

From that second screenshot, only extract two additional stats, and only if you can identify
their column confidently by icon (don't guess from position alone):
- devCardsBought: the column marked with a purple development-card icon and a "+" sign
  (development cards bought).
- trades: the column marked with a two-way swap/arrows "trade" icon and a "+" sign
  (trades completed).
Omit either field entirely for a player if you aren't confident which column it is — don't guess.

Extract every player's exact displayed name (including any # tag, e.g. "Osborn#6358") and their
final total victory point count (the number next to the trophy icon, not dice/resource/dev-card
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
                  devCardsBought: {
                    type: "number",
                    description:
                      "Development cards bought, from the purple dev-card '+' column in a second stats screenshot. Omit if not confidently identifiable.",
                  },
                  trades: {
                    type: "number",
                    description:
                      "Trades completed, from the swap-arrows '+' column in a second stats screenshot. Omit if not confidently identifiable.",
                  },
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

  const input = toolUse.input as {
    players: { name: string; victoryPoints: number; devCardsBought?: number; trades?: number }[];
    winnerName: string;
  };

  if (!input.players?.length || !input.winnerName) {
    throw new Error("Couldn't find any players in those screenshots. Try again with clearer screenshots.");
  }

  return {
    players: input.players.map((p) => ({
      rawName: p.name,
      victoryPoints: p.victoryPoints,
      devCardsBought: p.devCardsBought,
      trades: p.trades,
    })),
    winnerRawName: input.winnerName,
  };
}
