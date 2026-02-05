-- CyberCity Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create laptop_ranges table
CREATE TABLE IF NOT EXISTS public.laptop_ranges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  min_price INTEGER NOT NULL,
  max_price INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT valid_price_range CHECK (min_price < max_price)
);

-- Create laptops table
CREATE TABLE IF NOT EXISTS public.laptops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  range_id UUID NOT NULL REFERENCES public.laptop_ranges(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_name VARCHAR(255),
  upload_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT fk_range FOREIGN KEY (range_id) REFERENCES public.laptop_ranges(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_laptops_range_id ON public.laptops(range_id);
CREATE INDEX IF NOT EXISTS idx_laptop_ranges_price ON public.laptop_ranges(min_price, max_price);
CREATE INDEX IF NOT EXISTS idx_laptops_created_at ON public.laptops(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for laptop_ranges
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.laptop_ranges
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.laptop_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laptops ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" 
  ON public.laptop_ranges FOR SELECT 
  USING (true);

CREATE POLICY "Enable read access for all users" 
  ON public.laptops FOR SELECT 
  USING (true);

-- Create policies for admin write access (using anon key for simplicity)
-- In production, implement proper authentication
CREATE POLICY "Enable insert for authenticated users" 
  ON public.laptop_ranges FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
  ON public.laptop_ranges FOR UPDATE 
  USING (true);

CREATE POLICY "Enable delete for authenticated users" 
  ON public.laptop_ranges FOR DELETE 
  USING (true);

CREATE POLICY "Enable insert for authenticated users" 
  ON public.laptops FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
  ON public.laptops FOR UPDATE 
  USING (true);

CREATE POLICY "Enable delete for authenticated users" 
  ON public.laptops FOR DELETE 
  USING (true);

-- Insert some sample data (optional)
INSERT INTO public.laptop_ranges (name, min_price, max_price, description) VALUES
  ('Budget Range', 10000, 20000, 'Perfect for students and basic computing needs. Includes essential features for everyday tasks.'),
  ('Mid Range', 20000, 40000, 'Ideal for professionals and content creators. Balanced performance and affordability.'),
  ('Premium Range', 40000, 70000, 'High-performance laptops for gaming and intensive work. Top-tier specifications.'),
  ('Ultra Premium', 70000, 150000, 'Flagship models with cutting-edge technology. The ultimate computing experience.')
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.laptop_ranges TO anon, authenticated;
GRANT ALL ON public.laptops TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create storage bucket (run this in Supabase Storage UI or via API)
-- Bucket name: laptop-images
-- Public: true
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

COMMENT ON TABLE public.laptop_ranges IS 'Stores laptop price ranges with descriptions';
COMMENT ON TABLE public.laptops IS 'Stores individual laptop images associated with price ranges';