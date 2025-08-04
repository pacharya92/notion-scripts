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

// Start and end dates (August only)
const startDate = dayjs('2025-08-01')
const endDate = dayjs('2025-08-31')

async function fillDatesAndDays() {
  try {
    let hasMore = true
    let nextCursor = undefined
    let pages = []

    // Fetch all rows sorted by Date in descending order
    while (hasMore) {
      const response = await notion.databases.query({
        database_id: DATABASE_ID,
        start_cursor: nextCursor,
        sorts: [
          {
            property: DATE_COLUMN,
            direction: 'descending'
          }
        ]
      })

      pages = pages.concat(response.results)
      hasMore = response.has_more
      nextCursor = response.next_cursor
    }

    console.log(`📦 Found ${pages.length} pages sorted by Date (descending).`)

    // Limit to July: max 31 rows
    const rowsToUpdate = pages.slice(0, 31)

    for (let i = 0; i < rowsToUpdate.length; i++) {
      const page = rowsToUpdate[i]
      const pageId = page.id

      const newDate = startDate.add(i, 'day')
      const dayName = newDate.format('dddd') // e.g., "Tuesday"

      console.log(
        `📅 Row ${i + 1}: Date → ${newDate.format('YYYY-MM-DD')}, Day (Title) → ${dayName}`
      )

      await notion.pages.update({
        page_id: pageId,
        properties: {
          [DATE_COLUMN]: {
            date: {
              start: newDate.format('YYYY-MM-DD'),
            },
          },
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

    console.log('🎉 Done updating August (31 rows).')
  } catch (error) {
    console.error('❌ Error:', error.body || error)
  }
}

fillDatesAndDays()
