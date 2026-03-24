import asyncpg
from datetime import datetime

class Database:
    def __init__(self):
        self.conn = None
        self.cursor = None
        self.path = None
    async def connect(self):
        from dotenv import load_dotenv
        import os

        load_dotenv()

        # Fetch variables
        DB_USER = os.getenv("DB_USER")
        DB_PASSWORD = os.getenv("DB_PASSWORD")
        DB_HOST = os.getenv("DB_HOST")
        DB_NAME = os.getenv("DB_NAME")

        try:
            self.conn = await asyncpg.create_pool(
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME,
                host=DB_HOST,
                port=6543
            )          
            print('Connected to database')
        except Exception as e:
            print(f"Connection failed: {e}")

    async def insertItemTableAsArray(self, items = []):
        # items = ScrapeForItems()
        time1 = datetime.now()
        print(f"insertItemTableAsArray called with {len(items)} items")
        async with self.conn.acquire() as pool:
            # Start a transaction on the acquired connection
            try:
                await pool.execute('''
                    INSERT INTO bdo_items (item, percentage, stock, price, recent_time)
                    SELECT unnest($1::text[]), unnest($2::real[]), unnest($3::int[]), unnest($4::real[]), CURRENT_DATE
                    ON CONFLICT (item, recent_time) DO 
                    UPDATE SET stock = EXCLUDED.stock, 
                            percentage = EXCLUDED.percentage, 
                            price = EXCLUDED.price
                ''', 
                [i[0] for i in items],
                [i[1] for i in items],
                [i[2] for i in items],
                [i[3] for i in items])
            except Exception as e:
                print(f"Transaction failed: {e}")
        time2 = datetime.now()
        diff = time2 - time1
        print(f"Time took to insert {diff.seconds}.{diff.microseconds}")
        
    async def selectAllItemRows(self):
        # await self.insertItemTableAsArray()
        try:
            time1 = datetime.now()
            items = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(15,1) AS full_price, percentage - (select percentage from bdo_items b where b.item = bdo_items.item and b.recent_time < CURRENT_DATE ORDER BY b.recent_time DESC LIMIT 1) as percent_diff, price - (select price from bdo_items b where b.item = bdo_items.item and b.recent_time < CURRENT_DATE ORDER BY b.recent_time DESC LIMIT 1) as price_diff from bdo_items WHERE recent_time = CURRENT_DATE ORDER BY percentage desc;
            ''')
            time2 = datetime.now()
            diff = time2 - time1
            print(f"Time took {diff.seconds}.{diff.microseconds}")
            return items
        except Exception as e:
            print(f"Transaction failed: {e}")
            return "Items Not Found"

    async def selectItem(self, item_name = ''):
        try:
            
            item = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(15,1) AS full_price, recent_time 
                                         FROM bdo_items WHERE item ILIKE $1 ORDER BY recent_time ASC LIMIT 60
            ''', item_name)
            return item
        except Exception as e:
            print(f"Select failed: {e}")
            raise
        
    async def selectItemRecentPrice(self, item_name = ''):
        try:
            
            item = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(15,1) AS full_price, recent_time 
                                         FROM bdo_items WHERE item ILIKE $1 ORDER BY recent_time DESC LIMIT 1
            ''', item_name)
            return item
        except Exception as e:
            print(f"Select failed: {e}")
            return "Item Not Found"
    
    async def selectItemsByRange(self, range = 0):
        try:
            items = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(15,1) AS full_price, recent_time FROM bdo_items
                                           WHERE (percentage <= $2 OR percentage >= $1) AND recent_time = CURRENT_DATE ORDER BY percentage DESC 
            ''', range, -range)
            return items
        except Exception as e:
            print(f"Select failed: {e}")
            return "Item Not Found"

    async def selectWeekBeforePrice(self, items: str, event_start_date: str):
        from datetime import datetime, timedelta
        try:
            if not items:
                return 'Empty items array'
        
            select_start = 'SELECT item, price, recent_time FROM bdo_items ' \
            'WHERE recent_time >= $1 AND recent_time < $2 AND item = $3 ORDER BY recent_time'

            last_week_date = event_start_date - timedelta(days=7)

            price_range = await self.conn.fetch(select_start, last_week_date, event_start_date, items)
            return price_range
        except Exception as e:
            print(f"Error select price history: {e}")

    async def selectAllEvents(self):
        '''This function returns items or categories impacted, event name, start date, end date '''
        print("Selecting All Events")
        try:
            events = await self.conn.fetch('''
                                SELECT e.name, e.impact, e.start_date, e.end_date, c.item_name
                                    FROM bdo_events e RIGHT JOIN event_contents c ON e.name = c.event_name 
                                           WHERE e.end_date >= CURRENT_DATE ORDER BY e.end_date  
                                           ''')
            print("done selecting All Events")

            return events
        except Exception as e:
            print(f"Error selecting events: {e}")

    async def updateEventImpact(self, impact, event_name):
        try:
            await self.conn.execute("""
                UPDATE bdo_events SET impact = $1 WHERE name = $2
                              """, impact, event_name)
            return True
        except Exception as e:
            print(f"Failed to update impact: {impact} - {event_name} - {e}")
            return False

    async def closeConnection(self):
        await self.conn.close()

# async def main():
#     db = Database()
#     await db.connect()
#     #await db.insertItemTableAsArray()
#     items = await db.selectAllItemRows()
#     for item in items:
#         print("items", item['item'], item['full_price'], item['percentage'])
#     item = await db.selectItem('Memory Fragment')
#     print('item', item)

# asyncio.run(main())
    