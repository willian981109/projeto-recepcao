-- ===============================
-- TABELA DE EVENTOS
-- ===============================
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,              -- Nome do evento
  event_date DATE NOT NULL,        -- Data do evento
  max_capacity INTEGER NOT NULL,   -- Limite contratado
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- TABELA DE CONVIDADOS
-- ===============================
CREATE TABLE IF NOT EXISTS guests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,       -- Evento ao qual o convidado pertence
  name TEXT NOT NULL,              -- Nome do convidado
  document TEXT,                   -- CPF / RG (opcional)
  has_companion BOOLEAN DEFAULT 0, -- Acompanhante
  children_count INTEGER DEFAULT 0,-- Crianças acima de 6 anos
  checked_in BOOLEAN DEFAULT 0,    -- Já entrou?
  is_extra BOOLEAN DEFAULT 0,      -- Entrou acima do limite?
  checkin_at DATETIME,             -- Horário do check-in
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- ===============================
-- TABELA DE USUÁRIOS (RECEPÇÃO)
-- ===============================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
