# Notion Scripts

A collection of scripts for automating tasks in Notion.

## Scripts

### fillDates
Automatically fills date fields in Notion databases.

### fillDays
Populates day-related information in Notion databases.

### listDatabases
Lists all available databases in your Notion workspace.

## Setup

1. Clone the repository
   ```bash
   git clone https://github.com/pacharya92/notion-scripts.git
   cd notion-scripts
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure your Notion API credentials
   - Create a `.env` file with your Notion API key
   - Set up integration access in your Notion workspace

4. Run the scripts as needed

## Usage

Each script can be run independently using Node.js:
```bash
node fillDates/fillDates.js
node fillDates/fillDays.js
node fillDates/listDatabases.js
```

### Database Requirements

For the scripts to work properly, your Notion database must have:
- A **"Date"** column (property)
- A **"Days"** column (property)
- The **"Date"** column must be sorted in **ascending order**

## Requirements

- Node.js (v14 or higher)
- Notion API access token
- npm for dependency management

## License

MIT