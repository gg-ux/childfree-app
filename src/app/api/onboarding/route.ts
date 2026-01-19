import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getAuthUser(request: NextRequest) {
  const { db } = await import("@/lib/db");
  const sessionToken = request.cookies.get("user_session")?.value;

  if (!sessionToken) return null;

  const session = await db.userSession.findUnique({
    where: { token: sessionToken },
    include: { user: { include: { profile: true } } },
  });

  if (!session || new Date() > session.expiresAt) return null;

  return session.user;
}

// Save onboarding progress
export async function POST(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { step, data } = await request.json();

    // Handle each onboarding step
    switch (step) {
      case 1: {
        // Basic info: name, birthdate, gender
        const { displayName, birthdate, gender } = data;

        if (!displayName || !birthdate || !gender) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Create or update profile
        await db.profile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            displayName,
            birthdate: new Date(birthdate),
            gender,
            childfreeStatus: "CHOICE", // Default, will be set in step 2
            relationshipStatus: "SINGLE", // Default
            seeking: [],
          },
          update: {
            displayName,
            birthdate: new Date(birthdate),
            gender,
          },
        });

        await db.user.update({
          where: { id: user.id },
          data: { onboardingStep: 1 },
        });

        break;
      }

      case 2: {
        // Childfree status
        const { childfreeStatus } = data;

        if (!childfreeStatus) {
          return NextResponse.json({ error: "Missing childfree status" }, { status: 400 });
        }

        await db.profile.update({
          where: { userId: user.id },
          data: { childfreeStatus },
        });

        await db.user.update({
          where: { id: user.id },
          data: { onboardingStep: 2 },
        });

        break;
      }

      case 3: {
        // What you're looking for
        const { seeking, relationshipStatus } = data;

        if (!seeking || !Array.isArray(seeking) || seeking.length === 0) {
          return NextResponse.json({ error: "Select at least one connection type" }, { status: 400 });
        }

        await db.profile.update({
          where: { userId: user.id },
          data: {
            seeking,
            relationshipStatus: relationshipStatus || undefined,
          },
        });

        await db.user.update({
          where: { id: user.id },
          data: { onboardingStep: 3 },
        });

        break;
      }

      case 4: {
        // Bio and preferences
        const { bio, genderPreferences, ageMin, ageMax, distanceMax, locationCity } = data;

        await db.profile.update({
          where: { userId: user.id },
          data: {
            bio: bio || null,
            genderPreferences: genderPreferences || [],
            ageMin: ageMin || 18,
            ageMax: ageMax || 99,
            distanceMax: distanceMax || 50,
            locationCity: locationCity || null,
          },
        });

        await db.user.update({
          where: { id: user.id },
          data: { onboardingStep: 4 },
        });

        break;
      }

      case 5: {
        // Complete onboarding - mark user as active
        await db.user.update({
          where: { id: user.id },
          data: {
            onboardingStep: 5,
            status: "ACTIVE",
          },
        });

        break;
      }

      default:
        return NextResponse.json({ error: "Invalid step" }, { status: 400 });
    }

    return NextResponse.json({ success: true, step });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}

// Get current onboarding state
export async function GET(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      step: user.onboardingStep,
      profile: profile
        ? {
            displayName: profile.displayName,
            birthdate: profile.birthdate,
            gender: profile.gender,
            childfreeStatus: profile.childfreeStatus,
            seeking: profile.seeking,
            relationshipStatus: profile.relationshipStatus,
            bio: profile.bio,
            genderPreferences: profile.genderPreferences,
            ageMin: profile.ageMin,
            ageMax: profile.ageMax,
            distanceMax: profile.distanceMax,
            locationCity: profile.locationCity,
          }
        : null,
    });
  } catch (error) {
    console.error("Onboarding fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch onboarding state" },
      { status: 500 }
    );
  }
}
