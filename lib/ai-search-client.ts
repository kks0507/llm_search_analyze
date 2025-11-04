import type { AISearchResult } from "./types"

const AI_SEARCH_API_URL = process.env.NEXT_PUBLIC_AI_SEARCH_API_URL || "http://115.145.129.143:40002/v1.0_beta"

export async function fetchAISearchResults(query: string): Promise<AISearchResult[]> {
  try {
    const response = await fetch(`${AI_SEARCH_API_URL}/prompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: query,
        homepageId: 1,
      }),
    })

    if (!response.ok) {
      console.error("AI Search API error:", response.status)
      return []
    }

    const data = await response.json()

    // Parse response based on API structure
    if (data.results?.book_results) {
      return data.results.book_results.map((result: any) => ({
        work_id: result.work_id,
        work_title: result.work_title || result.book_title || "",
        work_author: result.work_author || result.book_author || "",
        similarity: result.similarity || 0,
        book_id: result.book_id,
        book_title: result.book_title,
        book_author: result.book_author,
      }))
    }

    return []
  } catch (error) {
    console.error("Failed to fetch AI search results:", error)
    return []
  }
}
