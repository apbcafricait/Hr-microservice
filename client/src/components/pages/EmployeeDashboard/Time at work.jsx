
import  { useState } from 'react';
import axios from 'axios';


const EmployeeDashboard = () => {
    const [duration, setDuration] = useState(null);
    const [isClockedIn, setIsClockedIn] = useState(false);

    const handleClockIn = async () => {
        const response = await axios.post('/api/clockin', { employeeId: 1 }); // Adjust with actual employee ID
        if (response.status === 201) {
            setIsClockedIn(true);
        }
    };

    const handleClockOut = async () => {
        const response = await axios.post('/api/clockout', { employeeId: 1 }); // Adjust with actual employee ID
        if (response.status === 200) {
            const { duration } = response.data;
            setDuration(duration);
            setIsClockedIn(false);
        }
    };

    return (
        <div>
            <h1>Employee Dashboard</h1>
            <button onClick={handleClockIn} disabled={isClockedIn}>
                Clock In
            </button>
            <button onClick={handleClockOut} disabled={!isClockedIn}>
                Clock Out
            </button>
            {duration && <p>Worked Duration: {duration}</p>}
        </div>
    );
};

export default EmployeeDashboard;