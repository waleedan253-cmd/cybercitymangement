import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

// Allowed image types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const rangeName = formData.get("productName") as string;
    const minPrice = parseInt(formData.get("minPrice") as string);
    const maxPrice = parseInt(formData.get("maxPrice") as string);
    const description = formData.get("description") as string;
    const images = formData.getAll("images") as File[];

    // Validate required fields
    if (!rangeName || !minPrice || !maxPrice || images.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate price range
    if (minPrice >= maxPrice) {
      return NextResponse.json(
        {
          success: false,
          error: "Min price must be less than max price",
        },
        { status: 400 },
      );
    }

    // Validate images
    for (const image of images) {
      if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid file type: ${image.name}. Only JPG, PNG, and WEBP are allowed.`,
          },
          { status: 400 },
        );
      }

      if (image.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `File too large: ${image.name}. Max size is 10MB.`,
          },
          { status: 400 },
        );
      }
    }

    // Check if range already exists
    const { data: existingRange, error: checkError } = await supabaseServer
      .from("laptop_ranges")
      .select("*")
      .eq("name", rangeName)
      .eq("min_price", minPrice)
      .eq("max_price", maxPrice)
      .maybeSingle(); // Use maybeSingle() instead of single()

    if (checkError) {
      console.error("Error checking existing range:", checkError);
      return NextResponse.json(
        { success: false, error: "Database error" },
        { status: 500 },
      );
    }

    let rangeId: string;

    if (existingRange) {
      rangeId = existingRange.id;

      // Update description if provided
      if (description) {
        const { error: updateError } = await supabaseServer
          .from("laptop_ranges")
          .update({ description, updated_at: new Date().toISOString() })
          .eq("id", rangeId);

        if (updateError) {
          console.error("Error updating range:", updateError);
        }
      }
    } else {
      // Create new range
      const { data: newRange, error: rangeError } = await supabaseServer
        .from("laptop_ranges")
        .insert({
          name: rangeName,
          min_price: minPrice,
          max_price: maxPrice,
          description: description || null,
        })
        .select()
        .single();

      if (rangeError || !newRange) {
        console.error("Range creation error:", rangeError);
        return NextResponse.json(
          {
            success: false,
            error: rangeError?.message || "Failed to create range",
          },
          { status: 500 },
        );
      }

      rangeId = newRange.id;
    }

    // Upload images
    const uploadedImages = [];
    const failedUploads = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      try {
        const fileExt = image.name.split(".").pop();
        const fileName = `${rangeId}/${uuidv4()}.${fileExt}`;

        // Convert to buffer
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to storage
        const { data: uploadData, error: uploadError } =
          await supabaseServer.storage
            .from("laptop-images")
            .upload(fileName, buffer, {
              contentType: image.type,
              upsert: false,
            });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          failedUploads.push({
            name: image.name,
            error: uploadError.message,
          });
          continue;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabaseServer.storage.from("laptop-images").getPublicUrl(fileName);

        // Insert laptop record
        const { error: laptopError } = await supabaseServer
          .from("laptops")
          .insert({
            range_id: rangeId,
            image_url: publicUrl,
            image_name: image.name,
            upload_order: i,
          });

        if (laptopError) {
          console.error("Laptop insert error:", laptopError);
          failedUploads.push({
            name: image.name,
            error: laptopError.message,
          });
          // Try to delete the uploaded file since DB insert failed
          await supabaseServer.storage.from("laptop-images").remove([fileName]);
        } else {
          uploadedImages.push({ url: publicUrl, name: image.name });
        }
      } catch (error) {
        console.error(`Error processing image ${image.name}:`, error);
        failedUploads.push({
          name: image.name,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Return response
    if (uploadedImages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "All uploads failed",
          details: failedUploads,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        rangeId,
        uploadedCount: uploadedImages.length,
        failedCount: failedUploads.length,
        images: uploadedImages,
        ...(failedUploads.length > 0 && { failedUploads }),
      },
      message: `Successfully uploaded ${uploadedImages.length} of ${images.length} images`,
    });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
