import { NextRequest, NextResponse } from "next/server";
import { scrapeCampWebsite } from "@/workflows/scrapeCampWebsite";
import { extractCampData } from "@/workflows/extractCampData";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, familyId } = body;

    if (!url || !familyId) {
      return NextResponse.json(
        { error: "url and familyId are required" },
        { status: 400 }
      );
    }

    // Step 1: Scrape the website
    const scrapedResult = await scrapeCampWebsite({ url });
    
    if (!scrapedResult.success || !scrapedResult.html) {
      return NextResponse.json(
        { 
          error: "Failed to scrape website",
          details: scrapedResult.error 
        },
        { status: 500 }
      );
    }

    // Step 2: Extract camp data using LLM
    const extractedResult = await extractCampData({
      html: scrapedResult.html,
      url,
    });

    if (!extractedResult.success) {
      return NextResponse.json(
        { 
          error: "Failed to extract camp data",
          details: extractedResult.error 
        },
        { status: 500 }
      );
    }

    // Step 3: Save to database in "considering" stage
    const camp = await prisma.camp.create({
      data: {
        familyId,
        name: extractedResult.data.name,
        sourceUrl: url,
        description: extractedResult.data.description || null,
        location: extractedResult.data.location || null,
        startDate: extractedResult.data.startDate 
          ? new Date(extractedResult.data.startDate) 
          : null,
        endDate: extractedResult.data.endDate 
          ? new Date(extractedResult.data.endDate) 
          : null,
        pricing: extractedResult.data.pricing || null,
        pricingDetails: extractedResult.data.pricingDetails || null,
        eligibilityCriteria: extractedResult.data.eligibilityCriteria || null,
        registrationProcess: extractedResult.data.registrationProcess 
          ? JSON.parse(JSON.stringify(extractedResult.data.registrationProcess))
          : null,
        lifecycleStage: "considering",
        rawExtractedData: JSON.parse(JSON.stringify(extractedResult.data)),
      },
    });

    // Step 4: Create activities if provided
    if (extractedResult.data.activities && extractedResult.data.activities.length > 0) {
      await prisma.campActivity.createMany({
        data: extractedResult.data.activities.map(activity => ({
          campId: camp.id,
          activityName: activity,
        })),
      });
    }

    // Fetch complete camp with activities
    const completeCamp = await prisma.camp.findUnique({
      where: { id: camp.id },
      include: {
        activities: true,
      },
    });

    return NextResponse.json(completeCamp, { status: 201 });
  } catch (error) {
    console.error("Error ingesting camp:", error);
    return NextResponse.json(
      { error: "Failed to ingest camp information" },
      { status: 500 }
    );
  }
}
