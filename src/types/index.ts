export interface Transaction {
  id: number;
  amount: number;
  comment: string;
  category_id: number;
  categoryName?: string;
  icon?: string;
  date: string;
}

export interface TopExpense {
  name: string;
  icon: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
}