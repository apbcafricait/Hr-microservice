const ApplyLeave = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Apply Leave</h2>
      <div className="bg-white p-4 rounded shadow">
        <form>
          <div className="mb-4">
            <label className="block mb-2">Leave Type</label>
            <select className="w-full p-2 border rounded">
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Start Date</label>
            <input type="date" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block mb-2">End Date</label>
            <input type="date" className="w-full p-2 border rounded" />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
