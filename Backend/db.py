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

    async def insertItemTableAsArray(self):
        items = ScrapeForItems()
        async with self.conn.acquire() as pool:
            # Start a transaction on the acquired connection
            async with pool.transaction():
                for item in items:
                    try:
                        date_check = await self.selectItem(item)
                        await pool.execute(''' 
                            INSERT INTO bdo_items (item, percentage, stock, price, recent_time) VALUES ($1, $2, $3, $4, CURRENT_DATE) 
                            ON CONFLICT (item) DO 
                            UPDATE SET stock = EXCLUDED.stock, percentage = EXCLUDED.percentage, price = EXCLUDED.price ''',
                            item[0], item[1], item[2], item[3])
                    except Exception as e:
                        print(f"Transaction failed: {e}")
        
    async def selectAllItemRows(self):
        # await self.insertItemTableAsArray()
        try:
            
            items = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(12,1) AS full_price from bdo_items order by percentage desc
            ''')
            return items
        except Exception as e:
            print(f"Transaction failed: {e}")
            return "Items Not Found"

    async def selectItem(self, item_name = ''):
        try:
            item = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(12,1) AS full_price, recent_time FROM bdo_items WHERE item = $1 ORDER BY percentage DESC 
            ''', item_name)
            return item
        except Exception as e:
            print(f"Select failed: {e}")
            return "Item Not Found"
    
    async def selectItemsByRange(self, range = 0):
        try:
            items = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(12,1) AS full_price, recent_time FROM bdo_items WHERE percentage <= $1 OR percentage > $1 ORDER BY percentage DESC 
            ''', range)
            return items
        except Exception as e:
            print(f"Select failed: {e}")
            return "Item Not Found"


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
    