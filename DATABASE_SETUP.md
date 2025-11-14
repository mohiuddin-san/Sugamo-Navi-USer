# Supabase Database Setup Guide

## Overview
This guide will help you set up the required database tables for the Sugamo Navi blog functionality.

## Prerequisites
- A Supabase account and project
- Access to the Supabase SQL Editor

## Database Schema Setup

### 1. Categories Table
This table stores blog categories like "観光スポット" (Tourist Spots), "グルメ" (Food), etc.

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Blogs Table
This table stores the actual blog posts with their content, images, and metadata.

```sql
-- Create blogs table  
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'draft',
  category_id UUID REFERENCES categories(id),
  top_image TEXT,
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Sample Data
Insert some sample categories and blog posts:

```sql
-- Insert sample categories
INSERT INTO categories (name) VALUES 
  ('観光スポット'),
  ('寺社・パワースポット'), 
  ('グルメ・食事'),
  ('ショッピング'),
  ('イベント・祭り');

-- Insert sample blogs
INSERT INTO blogs (title, details, status, category_id, top_image, publish_date)
SELECT 
  '巣鴨地蔵通り商店街の魅力',
  '巣鴨地蔵通り商店街は、「おばあちゃんの原宿」として親しまれている東京の人気観光スポットです。江戸時代から続く歴史ある商店街で、とげぬき地蔵として知られる高岩寺を中心に、約200店舗が軒を連ねています。

商店街では、お年寄りに優しい商品やサービスが充実しており、赤いパンツで有名なマルジや、塩大福で人気のみずのなど、個性的なお店が楽しめます。

毎月4、14、24日の縁日には多くの参拝客で賑わい、地元グルメや伝統的な和菓子を味わうことができます。',
  'publish',
  c.id,
  '/src/sugamo-street.jpg',
  NOW()
FROM categories c WHERE c.name = '観光スポット';

INSERT INTO blogs (title, details, status, category_id, top_image, publish_date)
SELECT 
  'とげぬき地蔵のご利益と参拝方法',
  '高岩寺のとげぬき地蔵は、正式には「延命地蔵菩薩」と呼ばれ、病気平癒や延命長寿のご利益があるとされています。

参拝の際は、まず本堂でお参りをし、その後「洗い観音」に清水をかけて自分の体の痛いところと同じ部分を洗うのが作法です。

縁日には境内で御影（おみかげ）というお札が配布され、これを飲み込むと病気が治るという言い伝えがあります。多くの人々が健康を願って訪れる、巣鴨のパワースポットです。',
  'publish',
  c.id,
  '/src/jizo-temple.jpg',
  NOW() - INTERVAL '1 day'
FROM categories c WHERE c.name = '寺社・パワースポット';

INSERT INTO blogs (title, details, status, category_id, top_image, publish_date)
SELECT 
  '巣鴨グルメガイド - 名物料理とおすすめスイーツ',
  '巣鴨には多くの美味しいグルメスポットがあります。特に有名なのは：

**古奈屋**：カレーうどんの老舗として知られ、コクのあるカレースープが自慢です。

**みずの**：塩大福発祥の店として有名で、甘さ控えめの大福は多くの人に愛されています。

**千成もなか**：手作りのもなかが自慢の和菓子店で、あんこの上品な甘さが人気です。

その他にも、昔ながらの喫茶店や、お年寄りに優しいメニューを提供するレストランが数多くあります。',
  'publish',
  c.id,
  '/src/sugamo-food.jpg',
  NOW() - INTERVAL '2 days'
FROM categories c WHERE c.name = 'グルメ・食事';
```

## Row Level Security (RLS)
Enable RLS for security:

```sql
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on categories" 
ON categories FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access on published blogs" 
ON blogs FOR SELECT 
USING (status = 'publish');
```

## Environment Variables
Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing
After setup, test by:
1. Refreshing the BlogList page
2. Checking that blogs load properly  
3. Verifying categories are displayed correctly

## Troubleshooting
- **Table not found**: Run the CREATE TABLE statements
- **No data**: Run the INSERT statements  
- **Permission denied**: Check RLS policies
- **Connection error**: Verify environment variables