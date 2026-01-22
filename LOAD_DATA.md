# Loading Demo Data into Supabase

Your container entries are not showing because the SQL demo data needs to be loaded into your Supabase database.

## Quick Steps:

### 1. Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: `lilfyclhggonwmwmtyqs`
3. Click on "SQL Editor" in the left sidebar

### 2. Create Tables (if not already done)

Copy and paste the contents of `sql/01_create_tables.sql` and run it.

### 3. Load Demo Data

Copy and paste the contents of `sql/02_demo_data.sql` and run it.

This will insert:
- **20 suppliers**
- **60 container items** (20 per container):
  - DEMO-001 SOUTH: 20 items
  - DEMO-002 NORTH: 20 items
  - DEMO-003 SOUTH: 20 items
- **4 arrivals records**
- **5 ENTYPO PARALAVIS records**

### 4. Verify Data Loaded

Run this query in Supabase SQL Editor:

```sql
SELECT container_name, COUNT(*) as items_count 
FROM container_items 
GROUP BY container_name 
ORDER BY container_name;
```

You should see 20 items for each container.

### 5. Refresh Your App

Once the data is loaded, refresh your browser at:
- Localhost: http://localhost:5555
- Production: Your Vercel URL

All 20 entries per container will now appear!

## Note About Data

The SQL file includes these container items:
- Each container has 20 different suppliers with unique reference codes
- Various statuses: READY TO SHIP, IN PRODUCTION, AWAITING SUPPLIER, NEED PAYMENT, PENDING
- Different clients: Alpha, Beta, Gamma, Delta, Epsilon
- Realistic CBM, costs, and contact information

If you still see only 2 entries, the SQL data hasn't been loaded yet to your Supabase database.
