# test_websocket.py
from unittest.mock import AsyncMock
from web_socket import ConnectionManager
import pytest

@pytest.mark.asyncio
async def test_connect_adds_to_active_connections():
    manager = ConnectionManager()
    mock_ws = AsyncMock()
    await manager.connect(mock_ws)
    assert mock_ws in manager.active_connections

def test_disconnect_removes_from_active_connections():
    manager = ConnectionManager()
    mock_ws = AsyncMock()
    manager.active_connections.append(mock_ws)
    manager.disconnect(mock_ws)
    assert mock_ws not in manager.active_connections

@pytest.mark.asyncio
async def test_broadcast_removes_dead_connection():
    manager = ConnectionManager()
    dead_ws = AsyncMock()
    dead_ws.send_json.side_effect = Exception("connection dead")
    manager.active_connections.append(dead_ws)
    await manager.broadcast([{"name": "test"}])
    assert dead_ws not in manager.active_connections