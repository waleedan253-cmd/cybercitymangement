import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET() {
  try {
    // Fetch all ranges
    const { data: ranges, error: rangesError } = await supabase
      .from("laptop_ranges")
      .select("*")
      .order("created_at", { ascending: false });

    if (rangesError) {
      console.error("Error fetching ranges:", rangesError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch ranges" },
        { status: 500 },
      );
    }

    // Fetch all laptops with their range information
    // FIXED: Specify the relationship name using !fk_range
    const { data: laptops, error: laptopsError } = await supabase
      .from("laptops")
      .select(
        `
        *,
        laptop_ranges!fk_range (
          name,
          min_price,
          max_price
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (laptopsError) {
      console.error("Error fetching laptops:", laptopsError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch laptops" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ranges: ranges || [],
        laptops: laptops || [],
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
