'use client';

import { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { app } from '../../../../lib/firebase';

interface ReportData {
  id: string;
  reportUrl: string;
  orderId: string;
  userId: string;
  userName: string;
  createdAt?: string;
}

export default function ReportsPage() {
  const db = getFirestore(app);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [testNames, setTestNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchReports = async () => {
      const labDocId = localStorage.getItem('labDocId');
      if (!labDocId) return;

      try {
        const snapshot = await getDocs(collection(db, `LabData/${labDocId}/Reports`));
        const results: ReportData[] = [];
        const testIdSet = new Set<string>();

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();

          if (!data.userId || !data.reportUrl || !data.orderId) continue;

          let userName = 'Unknown';
          try {
            const userDoc = await getDoc(doc(db, `UserData/${data.userId}`));
            if (userDoc.exists()) {
              const u = userDoc.data();
              userName = u.name || u.fullName || u.userName || 'Unnamed';
            }
          } catch (err) {
            console.warn(`⚠️ Could not fetch user for ID ${data.userId}`, err);
          }

          let createdAtStr = '';
          if (data.createdAt) {
            if (typeof data.createdAt === 'string') {
              createdAtStr = data.createdAt;
            } else if (typeof data.createdAt.toDate === 'function') {
              createdAtStr = data.createdAt.toDate().toLocaleString();
            }
          }

          if (data.orderId) {
            testIdSet.add(data.orderId);
          }

          results.push({
            id: docSnap.id,
            reportUrl: data.reportUrl,
            orderId: data.orderId,
            userId: data.userId,
            userName,
            createdAt: createdAtStr,
          });
        }

        setReports(results);

        // Fetch test names for all unique orderIds (testIds)
        const testIdArr = Array.from(testIdSet);
        const testNameMap: Record<string, string> = {};
        await Promise.all(
          testIdArr.map(async (testId) => {
            try {
              const bookingDoc = await getDoc(doc(db, `LabData/${labDocId}/Bookings/${testId}`));
              if (bookingDoc.exists()) {
                const bookingData = bookingDoc.data();
                if (bookingData.testName) {
                  testNameMap[testId] = bookingData.testName;
                } else if (bookingData.testId) {
                  const testDoc = await getDoc(doc(db, `TestData/${bookingData.testId}`));
                  if (testDoc.exists()) {
                    const testData = testDoc.data();
                    testNameMap[testId] = testData.name || 'Unknown Test';
                  } else {
                    testNameMap[testId] = 'Unknown Test';
                  }
                } else {
                  testNameMap[testId] = 'Unknown Test';
                }
              } else {
                testNameMap[testId] = 'Unknown Test';
              }
            } catch {
              testNameMap[testId] = 'Unknown Test';
            }
          })
        );
        setTestNames(testNameMap);

      } catch (err) {
        console.error('❌ Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [db]);

  const handleDelete = async (reportId: string) => {
    const labDocId = localStorage.getItem('labDocId');
    if (!labDocId) return;

    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      await deleteDoc(doc(db, `LabData/${labDocId}/Reports/${reportId}`));
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      alert('🗑️ Report deleted.');
    } catch (err) {
      console.error('❌ Failed to delete report:', err);
      alert('Failed to delete.');
    }
  };

  const uniqueUsers = Array.from(
    new Map(reports.map((r) => [r.userId, r.userName])).entries()
  ).filter(([uid, name]) => {
    const term = searchTerm.toLowerCase();
    return (
      uid.toLowerCase().includes(term) ||
      name.toLowerCase().includes(term) ||
      reports.some(
        (r) =>
          r.userId === uid &&
          (r.id.toLowerCase().includes(term) ||
            (testNames[r.orderId]?.toLowerCase().includes(term)) ||
            r.orderId.toLowerCase().includes(term))
      )
    );
  });

  function isWithinDateRange(createdAt?: string) {
    if (!createdAt) return true;
    if (!dateFrom && !dateTo) return true;
    const date = new Date(createdAt);
    if (dateFrom && date < new Date(dateFrom)) return false;
    if (dateTo && date > new Date(dateTo + 'T23:59:59')) return false;
    return true;
  }

  const filteredReports = reports.filter((r) => {
    const matchesUser = selectedUserId ? r.userId === selectedUserId : true;
    const matchesDate = isWithinDateRange(r.createdAt);
    return matchesUser && matchesDate;
  });

  return (
    <div className="flex min-h-screen bg-[#00ACC1] py-10 px-2 md:px-8">
      {/* Sidebar */}
      <aside className="bg-white rounded-lg shadow-lg p-6 min-w-[240px] max-w-xs mr-8 flex flex-col">
        <h3 className="text-xl font-bold text-[#374151] mb-4">Patients</h3>
        <input
          type="text"
          placeholder="Search patients, test, id..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00ACC1] text-[#374151]"
        />
        <ul className="flex-1 overflow-y-auto mb-4">
          <li
            className={`py-2 px-2 rounded cursor-pointer ${!selectedUserId ? 'bg-[#3FA65C] text-white font-semibold' : 'hover:bg-gray-100 text-[#374151]'}`}
            onClick={() => setSelectedUserId(null)}
          >
            All Patients
          </li>
          {uniqueUsers.map(([uid, name]) => (
            <li
              key={uid}
              className={`py-2 px-2 rounded cursor-pointer mt-1 ${selectedUserId === uid ? 'bg-[#3FA65C] text-white font-semibold' : 'hover:bg-gray-100 text-[#374151]'}`}
              onClick={() => setSelectedUserId(uid)}
            >
              {name} <span className="text-xs text-gray-500">({uid})</span>
            </li>
          ))}
        </ul>
        <hr className="my-3" />
        <div>
          <label className="block text-[#374151] mb-1 text-sm font-medium">
            From:
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="block w-full mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00ACC1] text-[#374151]"
            />
          </label>
          <label className="block text-[#374151] mb-1 text-sm font-medium mt-2">
            To:
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="block w-full mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00ACC1] text-[#374151]"
            />
          </label>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 bg-white rounded-lg shadow-lg p-8 overflow-x-auto">
        <h2 className="text-3xl font-bold text-[#374151] mb-6 text-center">Reports</h2>
        {loading ? (
          <div className="text-center text-[#374151]">Loading...</div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center text-[#374151]">No reports found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Patient</th>
                  <th className="border border-gray-300 p-3 text-left">Test</th>
                  <th className="border border-gray-300 p-3 text-left">Created At</th>
                  <th className="border border-gray-300 p-3 text-left">Report</th>
                  <th className="border border-gray-300 p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-[#e0f7fa] transition">
                    <td className="border border-gray-300 p-3">{report.userName}</td>
                    <td className="border border-gray-300 p-3">{testNames[report.orderId] || 'Unknown'}</td>
                    <td className="border border-gray-300 p-3">{report.createdAt}</td>
                    <td className="border border-gray-300 p-3">
                      <a
                        href={report.reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800 transition"
                      >
                        View
                      </a>
                    </td>
                    <td className="border border-gray-300 p-3">
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="bg-[#F57F17] text-white py-1 px-3 rounded hover:bg-[#d66b0f] transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
