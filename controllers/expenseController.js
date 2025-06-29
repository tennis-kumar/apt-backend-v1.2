import Expense from '../models/Expense.js';
import Flat from '../models/Flat.js';

const categoryMap = {
  security: 'Security Salary',
  utilities: 'Utility Bill',
  gardening: 'Gardening',
  maintenance: 'Maintenance',
  generator: 'Gen Set',
  water: 'Water Bill',
  electricity: 'Electricity Bill'
};

export const getExpenseHistory = async (req, res) => {
  try {
    const user = req.user;
    const flat = await Flat.findById(user.flat);
    
    const expenses = await Expense.aggregate([
      { $match: { apartment: flat.apartment } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%B %d", date: "$date" } },
            category: "$category"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          items: {
            $push: {
              category: "$_id.category",
              amount: "$total"
            }
          },
          total: { $sum: "$total" }
        }
      },
      {
        $project: {
          date: "$_id",
          items: {
            $concatArrays: [
              "$items",
              [{ category: "Total", amount: "$total" }]
            ]
          },
          _id: 0
        }
      }
    ]);

    const formatted = expenses.map(entry => ({
      [entry.date]: entry.items.map(item => ({
        list: categoryMap[item.category] || item.category,
        amount: `${item.amount.toLocaleString('en-IN')}₹`
      }))
    }));

    res.json({
      status: 'success',
      data: formatted
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};