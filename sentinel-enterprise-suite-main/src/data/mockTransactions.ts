import { Transaction } from "@/components/dashboard/TransactionRow";

const entities = [
  "Acme Corporation",
  "GlobalTech Solutions",
  "Sterling Industries",
  "Nexus Dynamics",
  "Vertex Partners",
  "Omega Holdings",
  "Pinnacle Group",
  "Quantum Systems",
  "Atlas Ventures",
  "Cipher Technologies",
  "Meridian Capital",
  "Horizon Enterprises",
  "Vanguard Associates",
  "Summit Consulting",
  "Eclipse Financial",
];

const departments = ["Finance", "Operations", "Sales", "Legal", "IT", "HR", "Procurement"];

const transactionTypes = [
  "Wire Transfer",
  "Invoice Payment",
  "Vendor Settlement",
  "Expense Reimbursement",
  "Capital Expenditure",
  "Service Fee",
  "Consulting Payment",
];

const statuses: Array<"pending" | "flagged" | "cleared"> = ["pending", "flagged", "cleared"];

function generateTimestamp(index: number): string {
  const now = new Date();
  const offset = index * 45000; // 45 seconds apart
  const timestamp = new Date(now.getTime() - offset);
  return timestamp.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function generateAmount(): number {
  const random = Math.random();
  if (random > 0.95) return Math.floor(Math.random() * 5000000) + 1000000; // $1M - $6M (5%)
  if (random > 0.8) return Math.floor(Math.random() * 900000) + 100000; // $100K - $1M (15%)
  if (random > 0.5) return Math.floor(Math.random() * 90000) + 10000; // $10K - $100K (30%)
  return Math.floor(Math.random() * 9000) + 1000; // $1K - $10K (50%)
}

function generateRiskScore(): number {
  const random = Math.random();
  if (random > 0.9) return Math.floor(Math.random() * 30) + 70; // High risk (10%)
  if (random > 0.7) return Math.floor(Math.random() * 30) + 40; // Medium risk (20%)
  return Math.floor(Math.random() * 35) + 5; // Low risk (70%)
}

export function generateMockTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, (_, i) => {
    const riskScore = generateRiskScore();
    const status = riskScore > 60 ? "flagged" : riskScore > 40 ? "pending" : "cleared";

    return {
      id: `TXN-${String(Date.now() - i * 1000).slice(-8)}-${String(i).padStart(4, "0")}`,
      timestamp: generateTimestamp(i),
      entity: entities[Math.floor(Math.random() * entities.length)],
      amount: generateAmount(),
      riskScore,
      status,
      department: departments[Math.floor(Math.random() * departments.length)],
      type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
    };
  });
}

export const mockTransactions = generateMockTransactions(50);
