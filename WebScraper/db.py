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
                port=6543,
                statement_cache_size=0
            )          
            print('Connected to database')
        except Exception as e:
            print(f"Connection failed: {e}")

    async def insertItemTableAsArray(self, items = []):
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

    async def closeConnection(self):
        await self.conn.close()