import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";
import ProductShowcase from "../../../components/customer/productshowcase";
import type { Metadata } from "next";

interface PageProps {
  params: {
    id: string;
  };
}

async function getRangeData(rangeId: string) {
  const { data: range, error: rangeError } = await supabase
    .from("laptop_ranges")
    .select("*")
    .eq("id", rangeId)
    .single();

  if (rangeError || !range) {
    return null;
  }

  const { data: laptops, error: laptopsError } = await supabase
    .from("laptops")
    .select("*")
    .eq("range_id", rangeId)
    .order("upload_order", { ascending: true });

  if (laptopsError) {
    return null;
  }

  return {
    range,
    laptops: laptops || [],
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const data = await getRangeData(params.id);

  if (!data) {
    return {
      title: "Range Not Found - CyberCity",
    };
  }

  return {
    title: `${data.range.name} - CyberCity`,
    description:
      data.range.description ||
      `Browse laptops in the ${data.range.name} price range`,
    openGraph: {
      title: `${data.range.name} - CyberCity`,
      description:
        data.range.description ||
        `Browse laptops in the ${data.range.name} price range`,
    },
  };
}

export default async function RangePage({ params }: PageProps) {
  const data = await getRangeData(params.id);

  if (!data) {
    notFound();
  }

  return <ProductShowcase range={data.range} laptops={data.laptops} />;
}
