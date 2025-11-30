import axios from "axios";
import AlumniDirectoryClient from "./AlumniDirectoryClient";

export const dynamic = "force-dynamic";

async function getAlumniFromApi() {
  try {
    // Use relative URL for API calls in the same app
    const baseUrl = process.env.NEXTAUTH_URL && "http://localhost:3002";
    
    const res = await axios.get(`${baseUrl}/api/alumni`, {
      timeout: 10000, // 10 second timeout
      headers: { 
        "Content-Type": "application/json",
      },
    });

    if (!res.data || !res.data.success) {
      console.error("API response not successful:", res.data);
      return {
        alumni: [],
        error: "Failed to load alumni data from server.",
      };
    }

    return {
      alumni: res.data.data || [],
      error: null,
    };
  } catch (error) {
    console.error("Error fetching alumni from API:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return {
      alumni: [],
      error: error.response?.data?.error || "Unable to load alumni directory. Please try again later.",
    };
  }
}

export default async function AlumniDirectoryPage() {
  const { alumni, error } = await getAlumniFromApi();

  return <AlumniDirectoryClient initialAlumni={alumni} initialError={error} />;
}