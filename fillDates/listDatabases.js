require('dotenv').config()
const { Client } = require('@notionhq/client')

// Load API key from .env
const NOTION_API_KEY = process.env.NOTION_API_KEY

if (!NOTION_API_KEY) {
  console.error('❌ Missing NOTION_API_KEY in .env file')
  process.exit(1)
}

// Initialize Notion client
const notion = new Client({ auth: NOTION_API_KEY })

async function listAllDatabases() {
  try {
    const response = await notion.search({
      filter: { property: 'object', value: 'database' },
    })

    if (response.results.length === 0) {
      console.log('❌ No databases found for this integration.')
      return
    }

    console.log(`🎯 Found ${response.results.length} database(s):`)
    response.results.forEach((db, index) => {
      const title = db.title.map((t) => t.plain_text).join('') || '(Untitled)'
      console.log(`🔹 ${index + 1}. ${title}`)
      console.log(`    📦 ID: ${db.id}`)
      console.log('---')
    })
  } catch (error) {
    console.error('❌ Error:', error.body || error)
  }
}


listAllDatabases()
