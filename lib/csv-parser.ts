import type { SurveyEntry, SurveyBook } from "./types"

function parseBookList(bookText: string): SurveyBook[] {
  if (!bookText || bookText.trim() === "") return []

  const books: SurveyBook[] = []

  // Split by numbered entries or line breaks
  const lines = bookText.split(/\n(?=\d\.|제목:|Title:|책\s|Buch)/)

  for (const line of lines) {
    const book = parseBookEntry(line.trim())
    if (book && book.title) {
      books.push(book)
    }
  }

  return books
}

function parseBookEntry(text: string): SurveyBook | null {
  if (!text) return null

  // Remove leading numbers and separators
  const cleaned = text.replace(/^\d+\.\s*/, "").trim()

  // Regex patterns for book info extraction
  const titleAuthorPattern =
    /^<([^>]+?)>\s*\/\s*([^/]+?)\s*\/|^《([^》]+?)》\s*\/\s*([^/]+?)\s*\/|^(?:제목:|Title:)?\s*([^\n]+?)\s*(?:저자:|Author:)/
  const publisherYearPattern = /\/([^/]+?)\s*\/\s*(\d{4}|20\d{2}|\$?\d{4}|c\d{4})/

  // Try various patterns
  const titleMatch = cleaned.match(titleAuthorPattern)
  let title = ""
  let author = ""

  if (titleMatch) {
    title = titleMatch[1] || titleMatch[3] || titleMatch[5] || ""
    author = titleMatch[2] || titleMatch[4] || ""
  } else {
    // Fallback: split by common separators
    const parts = cleaned.split(/\s*\/\s+/)
    if (parts.length > 0)
      title = parts[0]
        .replace(/^(<|《|")/g, "")
        .replace(/(>|》|")\s*$/g, "")
        .trim()
    if (parts.length > 1) author = parts[1].trim()
  }

  // Extract publisher and year
  const pubYearMatch = cleaned.match(publisherYearPattern)
  let publisher = ""
  let year = ""

  if (pubYearMatch) {
    publisher = pubYearMatch[1].trim()
    year = pubYearMatch[2].replace(/[()]/g, "").trim()
  }

  if (!title && !author) return null

  return {
    title: title || "(제목 없음)",
    author: author || "(저자 불명)",
    publisher: publisher || "(출판사 불명)",
    year: year || "(연도 불명)",
  }
}

export function parseCSV(csvContent: string): SurveyEntry[] {
  const lines = csvContent.split("\n")
  if (lines.length < 2) return []

  const entries: SurveyEntry[] = []

  // D=query1, J=queryType1
  // F=query2, G=queryType2
  // H=query3, L=queryType3
  // E, I, K = book recommendations
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const entry = parseCSVLineNew(line)
    if (entry) {
      entries.push(entry)
    }
  }

  return entries
}

function parseCSVLineNew(line: string): SurveyEntry | null {
  // Parse CSV with quoted fields
  const fields: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  fields.push(current.trim())

  // A(0)=timestamp, B(1)=name, C(2)=studentId
  // D(3)=query1, E(4)=books1, F(5)=query2, G(6)=queryType2
  // H(7)=query3, I(8)=books3?, J(9)=queryType1, K(10)=?, L(11)=queryType3
  if (fields.length < 12) {
    console.log(`[CSV Parser] Line has only ${fields.length} fields, expected at least 12`)
    return null
  }

  return {
    timestamp: fields[0] || "",
    name: fields[1] || "",
    studentId: fields[2] || "",
    query1: fields[3] || "",
    books1: parseBookList(fields[4] || ""),
    queryType1: normalizeQueryType(fields[9] || ""),
    query2: fields[5] || "",
    books2: parseBookList(fields[6] || ""),
    queryType2: normalizeQueryType(fields[6] || ""),
    query3: fields[7] || "",
    books3: parseBookList(fields[8] || ""),
    queryType3: normalizeQueryType(fields[11] || ""),
  }
}

function normalizeQueryType(typeStr: string): string {
  const normalized = typeStr.trim()
  // Match against known types
  const knownTypes = [
    "🧑‍🔬 과제/연구 수행형",
    "📚 전공/심화 학습형",
    "🌍 사회/문화/과학 주제 탐구형",
    "🎨 문학/콘텐츠 추천형",
    "🧘 개인적 성장/문제 해결형",
  ]

  const match = knownTypes.find((kt) => normalized.includes(kt) || kt.includes(normalized))
  return match || normalized
}
