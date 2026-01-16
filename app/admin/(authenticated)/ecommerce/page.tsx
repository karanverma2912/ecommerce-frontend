export default function EcommercePage() {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] bg-white rounded-xl border border-gray-100 shadow-sm border-dashed p-10 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🛒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">eCommerce Management</h2>
            <p className="text-gray-500 max-w-md">Product management, orders, and customer tracking features will be available here.</p>
        </div>
    );
}
