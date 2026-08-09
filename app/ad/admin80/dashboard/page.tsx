export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Products
          </h3>
          <p className="text-3xl font-bold">
            120
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Orders
          </h3>
          <p className="text-3xl font-bold">
            85
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Users
          </h3>
          <p className="text-3xl font-bold">
            450
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Revenue
          </h3>
          <p className="text-3xl font-bold">
            $12,500
          </p>
        </div>
      </div>
    </div>
  );
} 