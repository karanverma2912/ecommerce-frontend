"use client";

export default function RecentTransactions() {
    const transactions = [
        {
            id: "CMD-101",
            user: "Bob Dean",
            avatar: "B",
            action: "Transfer to bank account",
            status: "Pending",
            statusColor: "bg-orange-100 text-orange-600",
            amount: "$158.00 USD",
            date: "24 Jan, 2024"
        },
        {
            id: "CMD-102",
            user: "Bank of America",
            avatar: "A",
            action: "Withdrawal to account",
            status: "Completed",
            statusColor: "bg-blue-100 text-blue-600",
            amount: "$258.00 USD",
            date: "26 June, 2024"
        },
        {
            id: "CMD-103",
            user: "Valencia Clenda",
            avatar: "V",
            action: "Transfer to bank account",
            status: "Completed",
            statusColor: "bg-green-100 text-green-600",
            amount: "$856.00 USD",
            date: "28 Feb, 2024"
        },
        {
            id: "CMD-104",
            user: "Maria Cardenas",
            avatar: "M",
            action: "Withdrawal to account",
            status: "Pending",
            statusColor: "bg-orange-100 text-orange-600",
            amount: "$542.00 USD",
            date: "01 Nov, 2024"
        },
    ];

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Latest transactions</h3>

            <div className="space-y-6">
                {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                                {tx.avatar}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{tx.user}</p>
                                <p className="text-xs text-gray-400">{tx.action}</p>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${tx.statusColor}`}>
                                {tx.status}
                            </span>
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-800">{tx.amount}</p>
                            <p className="text-xs text-gray-400">{tx.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
