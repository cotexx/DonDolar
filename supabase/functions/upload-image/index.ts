import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Validate request
    if (req.method !== "POST") {
      throw new Error("Method not allowed");
    }

    const makeSignature = req.headers.get("x-hook-signature");
    if (!makeSignature) {
      throw new Error("Missing webhook signature");
    }

    // Get the image data from the request
    const { imageUrl, fileName } = await req.json();
    
    if (!imageUrl || !fileName) {
      throw new Error("Missing required fields");
    }

    // Download the image from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to fetch image");
    }

    const imageBlob = await imageResponse.blob();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("news-images")
      .upload(fileName, imageBlob, {
        contentType: imageResponse.headers.get("content-type") || "image/jpeg",
        upsert: true
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from("news-images")
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({ success: true, url: publicUrl }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});