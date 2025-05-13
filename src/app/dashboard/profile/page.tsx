import React from "react";

function Page() {
  const labDetails = {
    labName: "MyLabGo Diagnostics",
    labDescription: "Providing accurate and reliable diagnostic services since 2010.",
    labImage: "/lab-image.jpg", // Replace with the actual image path
    avatar: "/avatar.jpg", // Replace with the actual avatar path
    stats: {
      inProgress: 12,
      totalTests: 150,
      ratings: 4.8,
      pendingTests: 5,
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Lab Header */}
      <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-6">
        <img
          src={labDetails.labImage}
          alt="Lab"
          className="w-32 h-32 rounded-lg object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-[#374151]">
            {labDetails.labName}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {labDetails.labDescription}
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <img
            src={labDetails.avatar}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-[#374151]">Lab Owner</h2>
            <p className="text-sm text-gray-600">Admin of the lab</p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-[#374151]">In Progress</h3>
          <p className="text-2xl font-bold text-[#3FA65C]">
            {labDetails.stats.inProgress}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-[#374151]">Total Tests</h3>
          <p className="text-2xl font-bold text-[#3FA65C]">
            {labDetails.stats.totalTests}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-[#374151]">Ratings</h3>
          <p className="text-2xl font-bold text-[#3FA65C]">
            {labDetails.stats.ratings} ⭐
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-[#374151]">Pending Tests</h3>
          <p className="text-2xl font-bold text-[#3FA65C]">
            {labDetails.stats.pendingTests}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
