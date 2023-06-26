let Balance = require("./model/Balance.model.ts");

export default class BalanceClient {
  async getBalance(where: { id: string }): Promise<typeof Balance> {
    return await Balance.findById(where);
  }

  async createBalance() {
    const userBalance = new Balance({});

    return userBalance;
  }

  async updateBalance(args: {
    where: {
      id: string;
    };
    data: {
      balance: number | null;
      payPeriod: number | null;
      rentAmount: number | null;
      shouldCalculateEndDate: boolean;
    };
  }): Promise<typeof Balance> {
    const balance = Number(args.data.balance);
    const payPeriod = Number(args.data.payPeriod);
    const rentAmount = Number(args.data.rentAmount);
    var currentPeriodEndDate: Date | null;

    // Calculate the current period end date

    if (args.data.shouldCalculateEndDate) {
      const today = new Date();
      const timestamp = today.setDate(today.getDate() + payPeriod);
      currentPeriodEndDate = new Date(timestamp);
    } else {
      currentPeriodEndDate = null;
    }

    const newBalance = await Balance.findByIdAndUpdate(args.where, {
      balance,
      payPeriod,
      currentPeriodEndDate,
      rentAmount,
    });

    return newBalance;
  }

  async updateBalanceAmount(args: {
    where: { id: string };
    data: { amount: number };
  }): Promise<Boolean> {
    await Balance.findByIdAndUpdate(args.where, {
      balance: {increment: args.data.amount},
    });

    return true;
  }

  async deleteBalance(id: string): Promise<Boolean> {
    await Balance.findByIdAndDelete(id);

    return true;
  }
}
