require('dotenv').config()
const { Client } = require('@notionhq/client')
const dayjs = require('dayjs')

// Load API key and database ID from .env
const NOTION_API_KEY = process.env.NOTION_API_KEY
const DATABASE_ID = process.env.DATABASE_ID

if (!NOTION_API_KEY || !DATABASE_ID) {
  console.error('❌ Missing NOTION_API_KEY or DATABASE_ID in .env file')
  process.exit(1)
}

// Initialize Notion client
const notion = new Client({ auth: NOTION_API_KEY })

// Column names
const DATE_COLUMN = 'Date'
const DAY_COLUMN = 'Day' // Title property

async function syncDaysWithDates() {
  try {
    let hasMore = true
    let nextCursor = undefined
    let pages = []

    // Fetch all rows
    while (hasMore) {
      const response = await notion.databases.query({
        database_id: DATABASE_ID,
        sorts: [
          { property: DATE_COLUMN, direction: 'ascending' }, // Ensure we iterate in date order
        ],
        start_cursor: nextCursor,
      })

      pages = pages.concat(response.results)
      hasMore = response.has_more
      nextCursor = response.next_cursor
    }

    console.log(`📦 Found ${pages.length} pages.`)

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      const pageId = page.id

      // Get the existing Date value
      const dateProp = page.properties[DATE_COLUMN]
      if (!dateProp || !dateProp.date || !dateProp.date.start) {
        console.warn(`⚠️ Row ${i + 1} missing Date. Skipping.`)
        continue
      }

      const dateValue = dateProp.date.start
      const dayName = dayjs(dateValue).format('dddd') // e.g., "Tuesday"

      console.log(`🔄 Row ${i + 1}: Date → ${dateValue}, Day (Title) → ${dayName}`)

      // Update Day (Title) property
      await notion.pages.update({
        page_id: pageId,
        properties: {
          [DAY_COLUMN]: {
            title: [
              {
                type: 'text',
                text: { content: dayName },
              },
            ],
          },
        },
      })
    }

    console.log('🎉 Done syncing Day column with Dates.')
  } catch (error) {
    console.error('❌ Error:', error.body || error)
  }
}

syncDaysWithDates()
