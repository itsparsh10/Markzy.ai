import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/services/db"; // Adjust based on tsconfig paths or relative path
import ToolHistory from "@/services/models/ToolHistory";

// ---------------------------------------------
// POST - Save tool history
// ---------------------------------------------
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, toolName, toolId, outputResult, prompt } = body;

    if (!userId || !toolName || !outputResult) {
      return NextResponse.json(
        { error: "Missing required fields: userId, toolName, outputResult" },
        { status: 400 }
      );
    }

    const toolHistory = new ToolHistory({
      userId,
      toolName,
      toolId: toolId || toolName, // fallback to toolName
      outputResult,
      prompt,
      generatedDate: new Date(),
    });

    await toolHistory.save();

    console.log(`✅ Tool history saved: ${toolName} for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Tool history saved successfully",
      data: {
        id: toolHistory._id,
        toolName: toolHistory.toolName,
        generatedDate: toolHistory.generatedDate,
      },
    });
  } catch (error) {
    console.error("❌ Error saving tool history:", error);
    return NextResponse.json(
      { error: "Failed to save tool history" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------
// GET - Fetch tool history using query params
// ---------------------------------------------
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const toolName = url.searchParams.get("toolName");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required query parameter: userId" },
        { status: 400 }
      );
    }

    const query: { userId: string; toolName?: string } = { userId };
    if (toolName) {
      query.toolName = toolName;
    }

    const history = await ToolHistory.find(query).sort({ generatedDate: -1 });

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("❌ Error fetching tool history:", error);
    return NextResponse.json(
      { error: "Failed to fetch tool history" },
      { status: 500 }
    );
  }
}
