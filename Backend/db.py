import asyncpg
import logging
from datetime import datetime, date
from discord_webhook import sendDiscordMessage

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

    async def insertItems(self, items = []):
        time1 = datetime.now()
        logger.info("insertItems called — upserting %d items", len(items))
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
                logger.exception("insertItems transaction failed — %d items | error: %s", len(items), e)
                raise
        time2 = datetime.now()
        diff = time2 - time1
        logger.info("insertItems completed in %d.%06ds", diff.seconds, diff.microseconds)
        
    async def selectAllItemRows(self):
        try:
            time1 = datetime.now()
            items = await self.conn.fetch(''' 
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

    async def selectBaselinePriceRange(self, items: str, event_start_date: str):
        from datetime import timedelta
        try:
            if not items:
                return []
        
            select_start = 'SELECT item, price, recent_time FROM bdo_items ' \
            'WHERE recent_time >= $1 AND recent_time < $2 AND item = $3 ORDER BY recent_time'

            last_week_date = event_start_date - timedelta(days=21)

            price_range = await self.conn.fetch(select_start, last_week_date, event_start_date, items)
            return price_range
        except Exception as e:
            logger.exception("selectBaselinePriceRange failed — item=%s | event_start=%s | error: %s", items, event_start_date, e)

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
                    SELECT DISTINCT ON (item.name) * from item, cte 
                        where cte.id = item.category_id and item.name != ANY($1::text[])  
            ''', items)
            logger.debug("selectIndirectItems — returned %d rows", len(indirect_items))
            return indirect_items
        except Exception as e:
            logger.exception("selectIndirectItems failed: %s", e)

    async def selectActiveIndirectItems(self):
        logger.debug("selectActiveIndirectItems — querying active events")
        try:
            indirect_items = await self.conn.fetch('''
                SELECT * FROM indirect_event_item WHERE end_date >= CURRENT_DATE
            ''',)
            logger.debug("selectAllEvents — returned %d rows", len(indirect_items))
            return indirect_items
        except Exception as e:
            logger.exception("selectAllEvents failed: %s", e)

    async def upsertIndirectEventItems(self, event_dict = {}):
        time1 = datetime.now()
        logger.info("upsertIndirectEventItems called — inserting %d items", len(event_dict))
        async with self.conn.acquire() as pool:
            try:
                for event, rows in event_dict.items():

                    await pool.execute('''
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

    async def updateEventImpact(self, impact, event_name):
        
        try:
            logger.info("updateEventImpact — event=%s | impact=%s", event_name, impact)
            status = await self.conn.execute("""
                UPDATE bdo_events SET impact = $1 WHERE name = $2
                AND CASE impact
                    WHEN 'High'   THEN 3
                    WHEN 'Medium' THEN 2
                    WHEN 'Low'    THEN 1
                    ELSE 0
                END < CASE $1
                    WHEN 'High'   THEN 3
                    WHEN 'Medium' THEN 2
                    WHEN 'Low'    THEN 1
                    ELSE 0
                END
            """, impact, event_name)
            if status == 'UPDATE 1':
                await sendDiscordMessage(f"Updated event {event_name} to impact level {impact}")
                logger.info("updateEventImpact — updated event=%s | impact=%s", event_name, impact)

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
                status = await pool.execute('''
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
                count = 1 if status == 'UPDATE 1' else 0
                return count
            except Exception as e:
                logger.exception(
                    "updateEventItem transaction failed — item=%s | event=%s | error: %s",
                    arg_dict['item'], arg_dict['event_name'], e
                )
                raise
        time2 = datetime.now()
        diff = time2 - time1
        logger.info("updateEventItem completed in %d.%06ds", diff.seconds, diff.microseconds)

    async def insertEvent(self, form_data):
        logger.info(
            "insertEvent called "
        )
        async with self.conn.acquire() as pool:
            try:
                await pool.execute('''
                    INSERT INTO bdo_events (name, start_date, end_date) VALUES
                    ($1, $2, $3) ON CONFLICT (name, start_date) DO NOTHING
                ''',
                form_data.event_name, date.fromisoformat(form_data.start_date), date.fromisoformat(form_data.end_date))

                await pool.execute('''
                    INSERT INTO event_contents (event_name, item_name)
                    SELECT $1, unnest($2::text[]) as item 
                ''',
                form_data.event_name, form_data.items)
            except Exception as e:
                logger.exception(
                    "insertEvent transaction failed — event=%s | error: %s",
                    form_data.event_name, e
                )
                raise

    async def upsertUser(self, email: str, name: str):
        try:
            await self.conn.execute('''
                INSERT INTO users (email, name) VALUES ($1, $2)
                ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
            ''', email, name)
        except Exception as e:
            logger.exception("upsertUser failed — email=%s | error: %s", email, e)
            raise
    
    async def getInvestments(self, email):
        try:
            investments = await self.conn.fetch('''
            SELECT distinct on (i.name) i.name, i.id, i.qty, i.buy_price, i.pnl, j.price, j.recent_time 
                    FROM investment i left join bdo_items j on i.name = j.item 
                        WHERE email = $1 AND sold = FALSE order by i.name, j.recent_time desc
                                                ''', email)
            return investments
        except Exception as e:
            logger.exception("getInvestments failed — email=%s | error: %s", email, e)
            raise

    async def getChartInvestmentData(self, email):
        try:
            chart_data = await self.conn.fetch('''
                select * 
                    from bdo_items as b 
                        where b.item in (
                                    select distinct on (name) name from investment where email = $1 AND sold = FALSE
                                        ) 
                        order by b.item, b.recent_time desc
                                               ''', email)
            return chart_data
        except Exception as e:
            logger.exception("getChartInvestmentData failed — email=%s | error: %s", email, e)
            raise

    async def upsertInvestment(self, email, data = {}):
        try:
            await self.conn.execute('''
                INSERT INTO investment (bought_at, name, qty, buy_price, email, wanted_price, notes)
                                    VALUES ($1, $2, $3, $4, $5, $6, $7) 
                                    ON CONFLICT (bought_at, name, email, buy_price) DO UPDATE
                                    SET qty = EXCLUDED.qty, wanted_price = EXCLUDED.wanted_price, notes = EXCLUDED.notes
                                    ''',
                                    data['date'].strftime('%Y-%m-%d'), data['item'], data['qty'], data['buyPrice'], email, data.get('event', ''), data.get('notes', ''))
        except Exception as e:
            logger.exception("upsertInvestment failed — email=%s | error: %s", email, e)
        raise
    
    async def deleteInvestment(self, id):
        try:
            await self.conn.execute('''
                DELETE FROM investment WHERE id = $1
                                    ''',
                                    id)
        except Exception as e:
            logger.exception("deleteInvestment failed — id=%s | error: %s", id, e)
            raise

    async def closeConnection(self):
        await self.conn.close()
    