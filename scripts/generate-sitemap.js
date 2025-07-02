import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const baseUrl = 'https://www.dondolar.com.ar';

// Static routes
const staticRoutes = [
  {
    path: '/',
    changefreq: 'daily',
    priority: 1.0
  },
  {
    path: '/noticias',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    path: '/crypto',
    changefreq: 'daily',
    priority: 0.8
  },
  {
    path: '/economia',
    changefreq: 'daily',
    priority: 0.8
  },
  {
    path: '/actualidad',
    changefreq: 'daily',
    priority: 0.8
  },
  {
    path: '/legal',
    changefreq: 'monthly',
    priority: 0.5
  }
];

// Function to slugify text (same as in your utils)
function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

const generateSitemap = async () => {
  try {
    console.log('Generating sitemap...');
    
    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not found. Generating sitemap with static routes only.');
    }
    
    let dynamicRoutes = [];
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Fetch all published news articles
      const { data: news, error } = await supabase
        .from('news')
        .select('id, title, created_at, type')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
      } else if (news) {
        // Generate dynamic routes for news articles
        dynamicRoutes = news.map(article => ({
          path: `/noticias/${article.id}/${slugify(article.title)}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: new Date(article.created_at).toISOString().split('T')[0]
        }));
        
        console.log(`Found ${news.length} published articles`);
      }
    }
    
    // Combine static and dynamic routes
    const allRoutes = [...staticRoutes, ...dynamicRoutes];
    
    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>${route.lastmod ? `
    <lastmod>${route.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    // Write sitemap to public directory
    fs.writeFileSync('./public/sitemap.xml', sitemap);
    console.log(`Sitemap generated successfully with ${allRoutes.length} URLs!`);
    console.log('Static routes:', staticRoutes.length);
    console.log('Dynamic routes:', dynamicRoutes.length);
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
};

generateSitemap();