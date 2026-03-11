import asyncpg
from web_scrape import ScrapeForItems

class Database:
    def __init__(self):
        self.conn = None
        self.cursor = None
        self.path = None
    async def connect(self):
        try:
            self.conn = await asyncpg.create_pool('postgres://postgres:1234@localhost/postgres')
            print('Connected to database')
        except Exception as e:
            print(f"Connection failed: {e}")

    async def insertItemTableAsArray(self, items = []):
        # items = ScrapeForItems()
        print(f"insertItemTableAsArray called with {len(items)} items")
        async with self.conn.acquire() as pool:
            # Start a transaction on the acquired connection
            try:
                # async with pool.transaction():
                #     for item in items:
                #             await pool.execute(''' 
                #                 INSERT INTO bdo_items (item, percentage, stock, price, recent_time) 
                #                 VALUES ($1, $2, $3, $4, CURRENT_DATE) 
                #                 ON CONFLICT (item, recent_time) DO 
                #                 UPDATE SET stock = EXCLUDED.stock, 
                #                         percentage = EXCLUDED.percentage, 
                #                         price = EXCLUDED.price''',
                #                 item[0], item[1], item[2], item[3])
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
        
    async def selectAllItemRows(self):
        # await self.insertItemTableAsArray()
        try:
            
            items = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(12,1) AS full_price, percentage - (select percentage from bdo_items b where b.item = bdo_items.item and b.recent_time < CURRENT_DATE ORDER BY b.recent_time DESC LIMIT 1) as percent_diff, price - (select price from bdo_items b where b.item = bdo_items.item and b.recent_time < CURRENT_DATE ORDER BY b.recent_time DESC LIMIT 1) as price_diff from bdo_items WHERE recent_time = CURRENT_DATE ORDER BY percentage desc;
            ''')
            return items
        except Exception as e:
            print(f"Transaction failed: {e}")
            return "Items Not Found"

    async def selectItem(self, item_name = ''):
        try:
            item = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(12,1) AS full_price, recent_time FROM bdo_items WHERE item = $1 AND recent_time = CURRENT_DATE ORDER BY percentage DESC 
            ''', item_name)
            return item
        except Exception as e:
            print(f"Select failed: {e}")
            return "Item Not Found"
    
    async def selectItemsByRange(self, range = 0):
        try:
            items = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(12,1) AS full_price, recent_time FROM bdo_items WHERE (percentage <= $2 OR percentage >= $1) AND recent_time = CURRENT_DATE ORDER BY percentage DESC 
            ''', range, -range)
            return items
        except Exception as e:
            print(f"Select failed: {e}")
            return "Item Not Found"

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
    