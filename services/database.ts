import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('dinheiro_manager.db');

export const setupDatabase = () => {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    
    -- Tabela de Categorias
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT NOT NULL
    );

    -- Tabela de Transações
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      comment TEXT,
      category_id INTEGER,
      date TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    );
  `);

  // Inserir categorias padrão se a tabela estiver vazia
  const categories = db.getAllSync('SELECT * FROM categories');
  if (categories.length === 0) {
    db.execSync(`
      INSERT INTO categories (name, icon) VALUES 
      ('Comida', '🍔'), ('Sobremesa', '🍩'), ('Doce', '🍬'), ('Jessica', '👩'),('2', '🍔'), ('3', '🍩'), ('4', '🍬'), ('5', '👩');
    `);
  }
  
  
};

export const deleteTransaction = (id: number) => {
  database.runSync('DELETE FROM transactions WHERE id = ?', [id]);
};

export const updateTransaction = (id: number, amount: number, comment: string, categoryId: number) => {
  database.runSync(
    'UPDATE transactions SET amount = ?, comment = ?, category_id = ? WHERE id = ?',
    [amount, comment, categoryId, id]
  );
};

export const database = db;