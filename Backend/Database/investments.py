import logging

logger = logging.getLogger(__name__)

class InvestmentActions:
    def __init__(self, db: Database):
        self.db = db
    
    async def deleteInvestment(self, id):
        try:
            await self.db.pool.execute('''
                DELETE FROM investment WHERE id = $1
                                    ''',
                                    id)
        except Exception as e:
            logger.exception("deleteInvestment failed — id=%s | error: %s", id, e)
            raise

    async def soldAllInvestment(self, id):
        try:
            await self.db.pool.execute('''
                UPDATE investment SET sold_qty = qty, sold = TRUE WHERE id = $1
                                    ''', id)
            pass
        except Exception as e:
            logger.exception("soldAllInvestment failed — id=%s | error: %s", id, e)
            raise

    async def getChartInvestmentData(self, email):
        try:
            chart_data = await self.db.pool.fetch('''
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
        from datetime import datetime
        try:
            await self.db.pool.execute('''
                WITH valid_item AS (
                    SELECT 1 FROM item WHERE name = $2
                                       )
                INSERT INTO investment (bought_at, name, qty, buy_price, email, wanted_price)
                                    SELECT $1, $2, $3, $4, $5, $6
                                    WHERE EXISTS (SELECT 1 FROM valid_item) 
                                    ON CONFLICT (bought_at, name, email, buy_price) DO UPDATE
                                    SET qty = EXCLUDED.qty, wanted_price = EXCLUDED.wanted_price, buy_price = EXCLUDED.buy_price
                                    ''',
                                    datetime.strptime(data['date'], "%Y-%m-%d").date(), data['item'], int(data['qty']), int(data['buyPrice']), email, int(data.get('wanted_sell_price', 0)) if data.get('wanted_sell_price') else None)
        except Exception as e:
            logger.exception("upsertInvestment failed — email=%s | error: %s", email, e)
            raise
    
    async def updateInvestment(self, investment_data = {}) -> None:
        try:
            await self.db.pool.execute('''
                UPDATE investment SET buy_price = $1, qty = $2, sold_qty = $3 WHERE id = $4
                                    ''',
                                    investment_data['buy_price'], investment_data['qty'], investment_data['sold_qty'], investment_data['id'])
        except Exception as e:
            logger.exception("updateInvestment failed | error: %s", id, e)
            raise

    async def getInvestments(self, email):
        try:
            investments = await self.db.pool.fetch('''
            SELECT 
                i.name, 
                i.id, 
                i.qty, 
                i.buy_price,
                (j.price - i.buy_price) as pnl,
                j.price,
                j.recent_time,
                i.sold_qty
            FROM investment i
            LEFT JOIN LATERAL (
                SELECT price, recent_time 
                FROM bdo_items 
                WHERE item = i.name 
                ORDER BY recent_time DESC 
                LIMIT 1
            ) j ON true
            WHERE i.email = $1 AND i.sold = FALSE
            ORDER BY i.name
                    ''', email)
            return investments
        except Exception as e:
            logger.exception("getInvestments failed — email=%s | error: %s", email, e)
            raise

    async def uniqueInvestments(self):
        try:
            async with self.db.pool.acquire() as conn:
                unique_investments = await conn.fetch('''
                    SELECT DISTINCT ON (name) name FROM investment
                                                ''')
                return unique_investments
        except Exception as e:
            logger.exception("uniqueInvestments failed — error: %s", e)
            raise

    async def upsertPredictedPrices(self, item = '', predicted_prices = None):
        try:
            if predicted_prices is None:
                predicted_prices = {}
            if item == '':
                raise ValueError("item cannot be empty")
            async with self.db.pool.acquire() as conn:
                await conn.execute('''
                    INSERT INTO ml_predictions (name, predicted_at, day_1, day_2, day_3, day_4, day_5, day_6, day_7)
                    VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (name, predicted_at) DO UPDATE
                    SET day_1 = EXCLUDED.day_1, day_2 = EXCLUDED.day_2,
                        day_3 = EXCLUDED.day_3, day_4 = EXCLUDED.day_4,
                        day_5 = EXCLUDED.day_5, day_6 = EXCLUDED.day_6,
                        day_7 = EXCLUDED.day_7
                ''', item,
                    predicted_prices['day_1']['pct_change'],
                    predicted_prices['day_2']['pct_change'],
                    predicted_prices['day_3']['pct_change'],
                    predicted_prices['day_4']['pct_change'],
                    predicted_prices['day_5']['pct_change'],
                    predicted_prices['day_6']['pct_change'],
                    predicted_prices['day_7']['pct_change']
                )
        except Exception as e:
            logger.exception("upsertPredictedPrices failed — error: %s", e)
            raise
