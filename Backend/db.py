import asyncpg
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        self.conn = None
        self.cursor = None
        self.path = None

    async def connect(self):
        from dotenv import load_dotenv
        import os

        load_dotenv()

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
            logger.info("Connected to database — host=%s | db=%s", DB_HOST, DB_NAME)
        except Exception as e:
            logger.exception("Database connection pool failed — host=%s | db=%s | error: %s", DB_HOST, DB_NAME, e)
            raise

    async def insertItemTableAsArray(self, items = []):
        time1 = datetime.now()
        logger.info("insertItemTableAsArray called — upserting %d items", len(items))
        async with self.conn.acquire() as pool:
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
                logger.exception("insertItemTableAsArray transaction failed — %d items | error: %s", len(items), e)
                raise
        time2 = datetime.now()
        diff = time2 - time1
        logger.info("insertItemTableAsArray completed in %d.%06ds", diff.seconds, diff.microseconds)
        
    async def selectAllItemRows(self):
        try:
            time1 = datetime.now()
            items = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(15,1) AS full_price, percentage - (select percentage from bdo_items b where b.item = bdo_items.item and b.recent_time < CURRENT_DATE ORDER BY b.recent_time DESC LIMIT 1) as percent_diff, price - (select price from bdo_items b where b.item = bdo_items.item and b.recent_time < CURRENT_DATE ORDER BY b.recent_time DESC LIMIT 1) as price_diff from bdo_items WHERE recent_time = CURRENT_DATE ORDER BY percentage desc;
            ''')
            time2 = datetime.now()
            diff = time2 - time1
            logger.info("selectAllItemRows returned %d rows in %d.%06ds", len(items), diff.seconds, diff.microseconds)
            return items
        except Exception as e:
            logger.exception("selectAllItemRows failed: %s", e)
            raise

    async def selectItem(self, item_name = ''):
        try:
            item = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(15,1) AS full_price, recent_time 
                FROM bdo_items WHERE item ILIKE $1 ORDER BY recent_time ASC LIMIT 60
            ''', item_name)
            return item
        except Exception as e:
            logger.exception("selectItem failed — item_name=%s | error: %s", item_name, e)
            raise
        
    async def selectItemRecentPrice(self, item_name = ''):
        try:
            item = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(15,1) AS full_price, recent_time 
                FROM bdo_items WHERE item ILIKE $1 ORDER BY recent_time DESC LIMIT 1
            ''', item_name)
            return item
        except Exception as e:
            logger.exception("selectItemRecentPrice failed — item_name=%s | error: %s", item_name, e)
            raise
    
    async def selectItemsByRange(self, range = 0):
        try:
            items = await self.conn.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(15,1) AS full_price, recent_time FROM bdo_items
                WHERE (percentage <= $2 OR percentage >= $1) AND recent_time = CURRENT_DATE ORDER BY percentage DESC 
            ''', range, -range)
            return items
        except Exception as e:
            logger.exception("selectItemsByRange failed — range=%s | error: %s", range, e)
            raise

    async def selectWeekBeforePrice(self, items: str, event_start_date: str):
        from datetime import timedelta
        try:
            if not items:
                return []
        
            select_start = 'SELECT item, price, recent_time FROM bdo_items ' \
            'WHERE recent_time >= $1 AND recent_time < $2 AND item = $3 ORDER BY recent_time'

            last_week_date = event_start_date - timedelta(days=7)

            price_range = await self.conn.fetch(select_start, last_week_date, event_start_date, items)
            return price_range
        except Exception as e:
            logger.exception("selectWeekBeforePrice failed — item=%s | event_start=%s | error: %s", items, event_start_date, e)

    async def selectAllEvents(self):
        logger.debug("selectAllEvents — querying active events")
        try:
            events = await self.conn.fetch('''
                SELECT e.name, e.impact, e.start_date, e.end_date, c.item_name, c.impact as item_impact, c.pct_diff
                FROM bdo_events e RIGHT JOIN event_contents c ON e.name = c.event_name 
                WHERE e.end_date >= CURRENT_DATE ORDER BY e.end_date  
            ''')
            logger.debug("selectAllEvents — returned %d rows", len(events))
            return events
        except Exception as e:
            logger.exception("selectAllEvents failed: %s", e)

    async def selectIndirectItems(self, items = []):
        logger.debug("selectIndirectItems — querying indirect items for %d items", len(items))
        try:
            indirect_items = await self.conn.fetch('''
                WITH cte AS (
                    select co.id 
                        from bdo_categories co left join item i on i.category_id = co.id 
                        where i.name = ANY($1::text[])
                                           )
                    SELECT * from item, cte 
                        where cte.id = item.category_id and item.name != ANY($1::text[])  
            ''', items)
            logger.debug("selectIndirectItems — returned %d rows", len(indirect_items))
            return indirect_items
        except Exception as e:
            logger.exception("selectIndirectItems failed: %s", e)

    async def selectCurrentIndirectItem(self):
        logger.debug("selectIndirectItems — querying active events")
        try:
            indirect_items = await self.conn.fetch('''
                SELECT * FROM indirect_event_item WHERE end_date >= CURRENT_DATE
            ''',)
            logger.debug("selectAllEvents — returned %d rows", len(indirect_items))
            return indirect_items
        except Exception as e:
            logger.exception("selectAllEvents failed: %s", e)



    async def updateIndirectTable(self, event_dict = {}):
        time1 = datetime.now()
        logger.info("insertItemTableAsArray called — upserting %d items", len(event_dict))
        async with self.conn.acquire() as pool:
            try:
                await pool.execute('''
                    INSERT INTO indirect_event_item (event_name, item_name, pct_diff, end_date)
                    SELECT unnest($1::text[]), unnest($2::text[]), unnest($3::float[]), unnest($4::date[])
                    ON CONFLICT (event_name, item_name, end_date) DO 
                    UPDATE SET pct_diff = EXCLUDED.pct_diff
                ''', 
                [i.get('event', '') for i in event_dict],
                [i.get('item', '') for i in event_dict],
                [i.get('pct_diff', '') for i in event_dict],
                [i.get('end_date', '') for i in event_dict])
            except Exception as e:
                logger.exception("insertItemTableAsArray transaction failed — %d items | error: %s", len(event_dict), e)
                raise
        time2 = datetime.now()
        diff = time2 - time1
        logger.info("insertItemTableAsArray completed in %d.%06ds", diff.seconds, diff.microseconds)

    async def updateEventImpact(self, impact, event_name):
        try:
            logger.info("updateEventImpact — event=%s | impact=%s", event_name, impact)
            await self.conn.execute("""
                UPDATE bdo_events SET impact = $1 WHERE name = $2
            """, impact, event_name)
            return True
        except Exception as e:
            logger.exception("updateEventImpact failed — event=%s | impact=%s | error: %s", event_name, impact, e)
            raise

    async def updateEventItem(self, **arg_dict):
        time1 = datetime.now()
        logger.info(
            "updateEventItem called — item=%s | event=%s | impact=%s | pct_diff=%.2f%%",
            arg_dict['item'], arg_dict['event_name'], arg_dict['impact'], arg_dict['pct_diff']
        )
        async with self.conn.acquire() as pool:
            try:
                await pool.execute('''
                    WITH cte AS 
                        (
                            SELECT * FROM event_contents WHERE item_name = $2
                            AND event_name = $3
                            AND date_inserted <= CURRENT_DATE
                            ORDER BY date_inserted DESC
                            LIMIT 1
                        )
                    UPDATE event_contents 
                        SET impact = $1,
                            pct_diff = $4
                        FROM cte 
                        WHERE event_contents.id = cte.id
                            AND $4 < cte.pct_diff
                ''', 
                arg_dict['impact'], arg_dict['item'], arg_dict['event_name'], arg_dict['pct_diff'])
            except Exception as e:
                logger.exception(
                    "updateEventItem transaction failed — item=%s | event=%s | error: %s",
                    arg_dict['item'], arg_dict['event_name'], e
                )
                raise
        time2 = datetime.now()
        diff = time2 - time1
        logger.info("updateEventItem completed in %d.%06ds", diff.seconds, diff.microseconds)

    async def closeConnection(self):
        await self.conn.close()