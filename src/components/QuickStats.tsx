import React from "react";
import { Card, CardContent } from '@/components/ui/card';
import { CircleDollarSign, TrendingUp, Wallet } from 'lucide-react';
import { CURRENCY } from '@/config/text.constants';
import { TEXT } from '@/config/text.constants';

interface QuickStatsProps {
  totalBalance: number;
  expenses: any[];
  isLoading: boolean;
}

export default function QuickStats({ totalBalance, expenses, isLoading }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card text-card-foreground shadow-sm bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 rounded-xl shadow-glow-sm">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{TEXT.stats.totalBalance || "Total Balance"}</p>
              <p className="text-2xl font-bold">{isLoading ? "..." : CURRENCY.format(totalBalance)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground shadow-sm bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-2 border-purple-500/20 rounded-xl">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <CircleDollarSign className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{TEXT.stats.monthlyExpenses}</p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : CURRENCY.format(expenses.reduce((acc, exp) => acc + exp.amount, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground shadow-sm bg-gradient-to-br from-green-500/20 to-green-500/5 border-2 border-green-500/20 rounded-xl">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{TEXT.stats.savingsRate}</p>
              <p className="text-2xl font-bold">{isLoading ? "..." : (expenses.length > 0 ? "65%" : "0%")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}