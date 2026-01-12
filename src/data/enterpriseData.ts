import { Transaction } from "@/components/dashboard/TransactionRow";
import { DollarSign, AlertTriangle, ShieldCheck, Zap, LucideIcon } from "lucide-react";

export interface KPIStat {
    title: string;
    value: string;
    icon: LucideIcon;
    variant: "default" | "secondary" | "destructive" | "primary" | "accent";
    subtitle: string;
    trend: {
        value: number;
        isPositive: boolean;
    };
}

export const enterpriseStats: KPIStat[] = [
    {
        title: "Global Compliance Exposure",
        value: "$892.4M",
        icon: DollarSign,
        variant: "destructive",
        subtitle: "Potential fines (EU & UK)",
        trend: { value: 15.2, isPositive: false },
    },
    {
        title: "Active Risk Flags",
        value: "247",
        icon: AlertTriangle,
        variant: "destructive",
        subtitle: "Across 14 jurisdictions",
        trend: { value: 8.5, isPositive: false },
    },
    {
        title: "Audit Coverage",
        value: "98.2%",
        icon: ShieldCheck,
        variant: "primary",
        subtitle: "Automated real-time checks",
        trend: { value: 1.4, isPositive: true },
    },
    {
        title: "Avg. Screening Latency",
        value: "42ms",
        icon: Zap,
        variant: "accent",
        subtitle: "Global sanctions list",
        trend: { value: 25, isPositive: true },
    },
];

export const enterpriseTransactions: Transaction[] = [
    {
        id: "txn_8921_uk",
        timestamp: "10:48:22",
        entity: "Barclays Intl. Settlement",
        amount: 14500000,
        riskScore: 12,
        status: "cleared",
        department: "Treasury",
        type: "Interbank Transfer",
    },
    {
        id: "txn_2812_eu",
        timestamp: "10:47:15",
        entity: "Deutsche Bank AG - FX",
        amount: 8250000,
        riskScore: 24,
        status: "cleared",
        department: "FOREX",
        type: "Currency Swap",
    },
    {
        id: "txn_9921_aml",
        timestamp: "10:46:58",
        entity: "Shell Entity #892 (Cyprus)",
        amount: 480000,
        riskScore: 94,
        status: "flagged",
        department: "Compliance",
        type: "High-Risk Withdrawal",
    },
    {
        id: "txn_7721_us",
        timestamp: "10:45:30",
        entity: "JPMorgan Chase Clearing",
        amount: 22100000,
        riskScore: 5,
        status: "cleared",
        department: "Settlements",
        type: "Wire Transfer",
    },
    {
        id: "txn_9922_san",
        timestamp: "10:44:12",
        entity: "Volga Export LLC",
        amount: 1250000,
        riskScore: 89,
        status: "flagged",
        department: "Sanctions",
        type: "Trade Finance",
    },
    {
        id: "txn_1102_apac",
        timestamp: "10:43:45",
        entity: "DBS Singapore HQ",
        amount: 5500000,
        riskScore: 8,
        status: "cleared",
        department: "APAC Desk",
        type: "Liquidity Inj.",
    },
    {
        id: "txn_3321_pci",
        timestamp: "10:42:10",
        entity: "Global Payments Proc.",
        amount: 320000,
        riskScore: 15,
        status: "pending",
        department: "Merchants",
        type: "Batch Settlement",
    },
    {
        id: "txn_8821_struct",
        timestamp: "10:41:05",
        entity: "Unknown Beneficiary (Cayman)",
        amount: 9900,
        riskScore: 78,
        status: "flagged",
        department: "AML Ops",
        type: "Structuring Alert",
    },
    {
        id: "txn_5521_crypto",
        timestamp: "10:40:22",
        entity: "Coinbase Institutional",
        amount: 2500000,
        riskScore: 45,
        status: "cleared",
        department: "Digital Assets",
        type: "Custody Transfer",
    },
    {
        id: "txn_4421_hft",
        timestamp: "10:39:55",
        entity: "Citadel Securities",
        amount: 18900000,
        riskScore: 3,
        status: "cleared",
        department: "Equities",
        type: "Block Trade",
    },
    {
        id: "txn_6621_pep",
        timestamp: "10:38:12",
        entity: "Sovereign Wealth Fund X",
        amount: 50000000,
        riskScore: 35,
        status: "pending",
        department: "Private Bank",
        type: "Investment",
    },
    {
        id: "txn_2221_retail",
        timestamp: "10:37:40",
        entity: "Walmart Inc. Payroll",
        amount: 12400000,
        riskScore: 1,
        status: "cleared",
        department: "Corporate",
        type: "ACH Batch",
    },
];
