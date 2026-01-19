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

        CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);

  const categories = db.getAllSync('SELECT * FROM categories');
    if (categories.length === 0) {
      db.execSync(`
        INSERT INTO categories (name, icon) VALUES 
        ('Comida', '🍔'), 
        ('Sobremesa', '🍰'),
        ('Mercado', '🛒'), 
        ('Transporte', '🚗'), 
        ('Viagem', '✈️'), 
        ('Saúde', '💊'), 
        ('Educação', '📚'), 
        ('Faculdade', '🏛️'),     
        ('Lazer', '🎮'), 
        ('Jogos', '👾'),          
        ('Hardware', '💻'),       
        ('Assinaturas', '💳'),    
        ('Variados', '📦'), 
        ('Moradia', '🏠'), 
        ('Pet', '🐶'), 
        ('Presentes', '🎁'),
        ('Roupas', '👕'),
        ('Academia', '🏋️'),
        ('Salário', '💰'), 
        ('Venda', '📈'),
        ('Investimento', '💎');
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
export const getWeeklySummary = () => {

  const query = `
    SELECT 
      SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as totalExpenses,
      SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as totalIncome
    FROM transactions 
    WHERE date >= date('now', '-7 days')
  `;
  return db.getFirstSync(query);
};

export const getTopExpenses = () => {

  const query = `
    SELECT 
      c.name, 
      c.icon 
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.amount < 0 
    ORDER BY t.amount ASC 
    LIMIT 3
  `;
  
  try {
    return db.getAllSync(query);
  } catch (error) {
    console.error("Erro na query", error);
    return [];
  }
};


export const getNotes = () => {
  return db.getAllSync('SELECT * FROM notes ORDER BY date DESC');
};

export const addNote = (title: string, content: string) => {
  db.runSync(
    'INSERT INTO notes (title, content, date) VALUES (?, ?, ?)',
    [title, content, new Date().toISOString()]
  );
};

export const deleteNote = (id: number) => {
  db.runSync('DELETE FROM notes WHERE id = ?', [id]);
};

export const updateNote = (id: number, title: string, content: string) => {
  database.runSync(
    'UPDATE notes SET title = ?, content = ? WHERE id = ?',
    [title, content, id]
  );
};

export const getTransactionsByMonth = (year: number, month: number) => {
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  const query = `
    SELECT date, amount 
    FROM transactions 
    WHERE strftime('%Y-%m', date) = ?
  `;
  return database.getAllSync(query, [monthStr]);
};

export const getTransactionsBySpecificDay = (dateStr: string) => {
  const query = `
    SELECT t.*, c.name as categoryName, c.icon 
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE date(t.date) = date(?)
    ORDER BY t.date DESC
  `;
  return database.getAllSync(query, [dateStr]);
};


export const database = db;