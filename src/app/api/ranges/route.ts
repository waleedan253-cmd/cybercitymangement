import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rangeId = searchParams.get("rangeId");

    // If rangeId is provided, fetch specific range with laptops
    if (rangeId) {
      const { data: range, error: rangeError } = await supabase
        .from("laptop_ranges")
        .select("*")
        .eq("id", rangeId)
        .single();

      if (rangeError) {
        console.error("Error fetching range:", rangeError);
        return NextResponse.json(
          { success: false, error: "Failed to fetch range" },
          { status: 500 },
        );
      }

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
        .eq("range_id", rangeId)
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
          range,
          laptops: laptops || [],
        },
      });
    }

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

    return NextResponse.json({
      success: true,
      data: ranges || [],
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const laptopId = searchParams.get("laptopId");

    if (!laptopId) {
      return NextResponse.json(
        { success: false, error: "Laptop ID is required" },
        { status: 400 },
      );
    }

    // First, get the laptop to find the image URL
    const { data: laptop, error: fetchError } = await supabase
      .from("laptops")
      .select("image_url")
      .eq("id", laptopId)
      .single();

    if (fetchError) {
      console.error("Error fetching laptop:", fetchError);
      return NextResponse.json(
        { success: false, error: "Laptop not found" },
        { status: 404 },
      );
    }

    // Extract the file path from the URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/laptop-images/[filepath]
    const urlParts = laptop.image_url.split("/laptop-images/");
    const filePath = urlParts[1];

    // Delete from storage
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from("laptop-images")
        .remove([filePath]);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
        // Continue anyway to delete the database record
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("laptops")
      .delete()
      .eq("id", laptopId);

    if (deleteError) {
      console.error("Error deleting laptop:", deleteError);
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Laptop deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
