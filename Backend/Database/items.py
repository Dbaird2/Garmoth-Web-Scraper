import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ItemActions:
    def __init__(self, db: Database):
        self.db = db
    
    async def announcedDrops(self):
        try:
            items = await self.db.pool.fetch('''
                SELECT item_name FROM announced_drops WHERE date_announced = CURRENT_DATE
            ''')
            return [i['item_name'] for i in items]
        except Exception as e:
            logger.exception("announcedDrops failed: %s", e)
            raise
    
    async def getRecentPriceHistory(self, item_name, days = 30):
        try:
            history = await self.db.pool.fetch('''
                select recent_time, percentage, item, stock, price from bdo_items where item = $1 order by recent_time limit $2;
                            ''', item_name, days)
            return history
        except:
            raise

    async def selectBaselinePriceRange(self, items: str, event_start_date: str):
        from datetime import timedelta
        try:
            if not items:
                return []
        
            select_start = 'SELECT item, price, recent_time FROM bdo_items ' \
            'WHERE recent_time >= $1 AND recent_time < $2 AND item = $3 ORDER BY recent_time'

            last_week_date = event_start_date - timedelta(days=21)

            price_range = await self.db.pool.fetch(select_start, last_week_date, event_start_date, items)
            return price_range
        except Exception as e:
            logger.exception("selectBaselinePriceRange failed — item=%s | event_start=%s | error: %s", items, event_start_date, e)

    

    async def selectIndirectItems(self, items = []):
        logger.debug("selectIndirectItems — querying indirect items for %d items", len(items))
        try:
            indirect_items = await self.db.pool.fetch('''
                SELECT DISTINCT ON (item_b) item_b, relationship FROM item_relationship WHERE item_a = ANY($1::TEXT[]) 
            ''', items)
            logger.debug("selectIndirectItems — returned %d rows", len(indirect_items))
            return indirect_items
        except Exception as e:
            logger.exception("selectIndirectItems failed: %s", e)

    async def selectActiveIndirectItems(self):
        logger.debug("selectActiveIndirectItems — querying active events")
        try:
            indirect_items = await self.db.pool.fetch('''
                SELECT * FROM indirect_event_item WHERE end_date >= CURRENT_DATE
            ''',)
            logger.debug("selectAllEvents — returned %d rows", len(indirect_items))
            return indirect_items
        except Exception as e:
            logger.exception("selectAllEvents failed: %s", e)

    async def upsertIndirectEventItems(self, event_dict = {}):
        time1 = datetime.now()
        logger.info("upsertIndirectEventItems called — inserting %d items", len(event_dict))
        async with self.db.pool.acquire() as conn:
            try:
                for event, rows in event_dict.items():

                    await conn.execute('''
                        INSERT INTO indirect_event_item (event_name, item_name, pct_diff, end_date)
                        SELECT unnest($1::text[]), unnest($2::text[]), unnest($3::float[]), unnest($4::date[])
                        ON CONFLICT (event_name, item_name, end_date) DO 
                        UPDATE SET pct_diff = EXCLUDED.pct_diff
                    ''', 
                    [i['event'] for i in rows],
                    [i['item'] for i in rows],
                    [i['pct_diff'] for i in rows],
                    [i['end_date'] for i in rows])

            except Exception as e:
                logger.exception("upsertIndirectEventItems transaction failed — %d items | error: %s", len(event_dict), e)
                raise
        time2 = datetime.now()
        diff = time2 - time1
        logger.info("upsertIndirectEventItems completed in %d.%06ds", diff.seconds, diff.microseconds)
    
    async def insertItems(self, items = []):
        time1 = datetime.now()
        logger.info("insertItems called — upserting %d items", len(items))
        async with self.db.pool.acquire() as conn:
            try:
                await conn.execute('''
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
                logger.exception("insertItems transaction failed — %d items | error: %s", len(items), e)
                raise
        time2 = datetime.now()
        diff = time2 - time1
        logger.info("insertItems completed in %d.%06ds", diff.seconds, diff.microseconds)
        
    async def selectAllItemRows(self):
        try:
            time1 = datetime.now()
            items = await self.db.pool.fetch(''' 
                SELECT g.id as id, item, percentage, stock, price::numeric(15,1) AS full_price, 
                    percentage - (
                                SELECT percentage 
                                    FROM bdo_items b 
                                    WHERE b.item = g.item AND b.recent_time < CURRENT_DATE 
                                    ORDER BY b.recent_time DESC LIMIT 1) AS percent_diff, 
                    price - (
                            SELECT price 
                                FROM bdo_items b 
                                WHERE b.item = g.item AND b.recent_time < CURRENT_DATE 
                                ORDER BY b.recent_time DESC LIMIT 1) AS price_diff, 
                    c.name as category_name
                FROM bdo_items AS g 
                    LEFT JOIN item AS i ON i.name = g.item 
                    LEFT JOIN bdo_categories c ON i.category_id = c.id 
                WHERE recent_time = CURRENT_DATE ORDER BY percentage desc
                ''')
            time2 = datetime.now()
            diff = time2 - time1
            logger.info("selectAllItemRows returned %d rows in %d.%06ds", len(items), diff.seconds, diff.microseconds)
            return items
        except Exception as e:
            logger.exception("selectAllItemRows failed: %s", e)
            raise

    async def recentDrops(self):
        try:
            items = await self.db.pool.fetch('''
            SELECT item, percentage, stock, price::numeric(15,1) AS full_price, 
                    percentage - (
                                SELECT percentage 
                                    FROM bdo_items b 
                                    WHERE b.item = g.item AND b.recent_time < CURRENT_DATE 
                                    ORDER BY b.recent_time DESC LIMIT 1) AS percent_diff, 
                    price - (
                            SELECT price 
                                FROM bdo_items b 
                                WHERE b.item = g.item AND b.recent_time < CURRENT_DATE 
                                ORDER BY b.recent_time DESC LIMIT 1) AS price_diff, 
                    c.name as category_name
                FROM bdo_items AS g 
                    LEFT JOIN item AS i ON i.name = g.item 
                    LEFT JOIN bdo_categories c ON i.category_id = c.id 
                WHERE recent_time = CURRENT_DATE and (percentage - (
                                SELECT percentage 
                                    FROM bdo_items b 
                                    WHERE b.item = g.item AND b.recent_time < CURRENT_DATE 
                                    ORDER BY b.recent_time DESC LIMIT 1)) <= -30 ORDER BY percentage desc
                                  ''')
            return items
        except Exception as e:
            logger.exception("recentDrops failed: %s", e)
            raise

    async def selectItem(self, item_name = ''):
        try:
            item = await self.db.pool.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(15,1) AS full_price, recent_time 
                FROM bdo_items WHERE item ILIKE $1 ORDER BY recent_time ASC LIMIT 60
            ''', item_name)
            return item
        except Exception as e:
            logger.exception("selectItem failed — item_name=%s | error: %s", item_name, e)
            raise
        
    async def selectItemRecentPrice(self, item_name = ''):
        try:
            item = await self.db.pool.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(15,1) AS full_price, recent_time 
                FROM bdo_items WHERE item ILIKE $1 ORDER BY recent_time DESC LIMIT 1
            ''', item_name)
            return item
        except Exception as e:
            logger.exception("selectItemRecentPrice failed — item_name=%s | error: %s", item_name, e)
            raise
    
    async def selectItemsByRange(self, range = 0):
        try:
            items = await self.db.pool.fetch(''' 
                SELECT id, item, percentage, stock, price::numeric(15,1) AS full_price, recent_time FROM bdo_items
                WHERE (percentage <= $2 OR percentage >= $1) AND recent_time = CURRENT_DATE ORDER BY percentage DESC 
            ''', range, -range)
            return items
        except Exception as e:
            logger.exception("selectItemsByRange failed — range=%s | error: %s", range, e)
            raise

    async def alikeItems(self, item):
        try:
            async with self.db.pool.acquire() as conn:
                rows = await conn.fetch('''
                    SELECT name FROM item WHERE name ilike '%' || $1 || '%' LIMIT 10
                                         ''', item)
                return [r['name'] for r in rows]
        except Exception as e:
            logger.exception("fetchItem failed — item=%s | error: %s", item, e)
            raise
    
    
        