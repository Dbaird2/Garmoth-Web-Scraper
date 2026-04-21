import asyncpg
import logging
from datetime import datetime, date
from discord_webhook import sendDiscordMessage

logger = logging.getLogger(__name__)

class EventActions:
    def __init__(self, db: Database):
        self.pool = db.pool

    async def insertEvent(self, form_data):
        logger.info(
            "insertEvent called "
        )
        async with self.pool.acquire() as conn:
            try:
                await conn.execute('''
                    INSERT INTO bdo_events (name, start_date, end_date) VALUES
                    ($1, $2, $3) ON CONFLICT (name, start_date) DO NOTHING
                ''',
                form_data.event_name, date.fromisoformat(form_data.start_date), date.fromisoformat(form_data.end_date))

                await conn.execute('''
                    INSERT INTO event_contents (event_name, item_name, quantity)
                    SELECT $1, unnest($2::text[]) as item, unnest($3::int[])
                ''',
                form_data.event_name, [i.item for i in form_data.items], [i.qty for i in form_data.items])
            except Exception as e:
                logger.exception(
                    "insertEvent transaction failed — event=%s | error: %s",
                    form_data.event_name, e
                )
                raise
    
    async def selectAllEvents(self):
        logger.debug("selectAllEvents — querying active events")
        try:
            events = await self.pool.fetch('''
                SELECT e.name, e.impact, e.start_date, e.end_date, c.item_name, c.impact as item_impact, c.pct_diff
                FROM bdo_events e RIGHT JOIN event_contents c ON e.name = c.event_name 
                WHERE e.end_date >= CURRENT_DATE ORDER BY e.end_date  
            ''')
            logger.debug("selectAllEvents — returned %d rows", len(events))
            return events
        except Exception as e:
            logger.exception("selectAllEvents failed: %s", e)
            raise
    
    async def updateEventItem(self, **arg_dict):
        logger.info(
            "updateEventItem called — item=%s | event=%s | impact=%s | pct_diff=%.2f%%",
            arg_dict['item'], arg_dict['event_name'], arg_dict['impact'], arg_dict['pct_diff']
        )
        async with self.pool.acquire() as conn:
            try:
                status = await conn.execute('''
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

    async def updateEventImpact(self, impact, event_name):
        
        try:
            logger.info("updateEventImpact — event=%s | impact=%s", event_name, impact)
            status = await self.pool.execute("""
                UPDATE bdo_events SET impact = $1 WHERE name = $2
                AND CASE impact
                    WHEN 'Very High' THEN 4
                    WHEN 'High'   THEN 3
                    WHEN 'Medium' THEN 2
                    WHEN 'Low'    THEN 1
                    ELSE 0
                END < CASE $1
                    WHEN 'Very High' THEN 4
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