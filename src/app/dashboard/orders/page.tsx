"use client";

import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  writeBatch,
  onSnapshot,
} from "firebase/firestore";
import { app, auth } from "../../../../lib/firebase";
import { CldUploadWidget } from "next-cloudinary";

interface Order {
  id: string;
  status: string;
  testName: string;
  patientName: string;
  reportUrl?: string;
  reportDocId?: string;
  labReportDocId?: string;
  date?: Date;
  paymentMethod?: string;
  testId?: string; // ← add this
  userId?: string; // ← and this
}

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "completed"
  >("all");
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);
  const user = auth.currentUser;

  useEffect(() => {
    const labDocId = localStorage.getItem("labDocId");
    if (!labDocId || !user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const unsub = onSnapshot(
      collection(db, `LabData/${labDocId}/Orders`),
      async (snapshot) => {
        try {
          const fetchedOrders: Order[] = [];

          for (const orderDoc of snapshot.docs) {
            const data = orderDoc.data();

            let testName = "N/A";
            let patientName = "N/A";
            let reportUrl: string | undefined = undefined;
            let reportDocId: string | undefined = undefined;
            let labReportDocId: string | undefined = undefined;
            let date: Date | undefined = undefined;
            let testId: string | undefined = undefined;
            let userId: string | undefined = undefined;

            // Get date from Firestore timestamp or fallback to today
            if (data["data-time"]) {
              if (typeof data["data-time"]?.toDate === "function") {
                date = data["data-time"].toDate();
              } else if (typeof data["data-time"] === "string") {
                date = new Date(data["data-time"]);
              }
            }
            if (!date) {
              date = new Date(); // fallback to today
            }

            // Fetch test name and test ID
            if (data.test_id?.path) {
              const p = data.test_id.path.split("/").filter(Boolean);
              if (p.length === 4) {
                testId = p[3]; // store test ID for later
                const testRef = doc(db, p[0], p[1], p[2], p[3]);
                const testSnap = await getDoc(testRef);
                testName = testSnap.exists()
                  ? testSnap.data()?.testName || "No Name"
                  : "No Name";
              }
            }

            // Fetch patient name and user ID, plus reports
            if (data.user_id?.path) {
              const u = data.user_id.path.split("/").filter(Boolean);
              if (u.length === 2) {
                userId = u[1]; // store user ID for later
                const userRef = doc(db, u[0], u[1]);
                const userSnap = await getDoc(userRef);
                patientName = userSnap.exists()
                  ? userSnap.data().name ||
                    userSnap.data().fullName ||
                    userSnap.data().userName ||
                    "Unnamed"
                  : "Unnamed";

                // Check User's report for this order
                const userReportQuery = query(
                  collection(db, `UserData/${u[1]}/Reports`),
                  where("orderId", "==", orderDoc.id)
                );
                const userReportSnap = await getDocs(userReportQuery);
                if (!userReportSnap.empty) {
                  const reportDoc = userReportSnap.docs[0];
                  reportUrl = reportDoc.data().reportUrl;
                  reportDocId = reportDoc.id;
                }

                // Check Lab's report for this order
                const labReportQuery = query(
                  collection(db, `LabData/${labDocId}/Reports`),
                  where("orderId", "==", orderDoc.id)
                );
                const labReportSnap = await getDocs(labReportQuery);
                if (!labReportSnap.empty) {
                  labReportDocId = labReportSnap.docs[0].id;
                }
              }
            }

            fetchedOrders.push({
              id: orderDoc.id,
              status: data.status || "unknown",
              testName,
              patientName,
              reportUrl,
              reportDocId,
              labReportDocId,
              date,
              paymentMethod: data.paymentMethod || "N/A",
              testId,
              userId,
            });
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          fetchedOrders.sort((a, b) => {
            const aDate = a.date ? new Date(a.date) : today;
            const bDate = b.date ? new Date(b.date) : today;

            const aIsToday = aDate.toDateString() === today.toDateString();
            const bIsToday = bDate.toDateString() === today.toDateString();
            if (aIsToday && !bIsToday) return -1;
            if (!aIsToday && bIsToday) return 1;

            const aIsLate = aDate < today;
            const bIsLate = bDate < today;
            if (aIsLate && !bIsLate) return -1;
            if (!aIsLate && bIsLate) return 1;

            return aDate.getTime() - bDate.getTime();
          });

          setOrders(fetchedOrders);
          setLoading(false);
        } catch (e) {
          console.error("🔥 Error fetching order data:", e);
          setLoading(false);
        }
      }
    );

    return () => unsub && unsub();
  }, [user]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const labDocId = localStorage.getItem("labDocId");
    if (!labDocId) return;
    await updateDoc(doc(db, `LabData/${labDocId}/Orders/${orderId}`), {
      status: newStatus,
    });

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleUpload = async (orderId: string, url: string) => {
  const labId = localStorage.getItem("labDocId");
  if (!labId) return;

  try {
    const orderDoc = await getDoc(doc(db, `LabData/${labId}/Orders/${orderId}`));
    const orderData = orderDoc.exists() ? orderDoc.data() : null;

    let patientId = null;
    if (orderData && orderData.user_id?.path) {
      const parts = orderData.user_id.path.split("/");
      patientId = parts.length === 2 ? parts[1] : null;
    }

    if (!patientId) {
      alert("❌ Could not find patient ID for this order.");
      return;
    }

    const batch = writeBatch(db);

    const labReportRef = doc(collection(db, `LabData/${labId}/Reports`));
    batch.set(labReportRef, {
      reportUrl: url,
      orderId,
      userId: patientId,
      createdAt: new Date(),
      labId, // lab id to save in firebase!
    });

    const userReportRef = doc(collection(db, `UserData/${patientId}/Reports`));
    batch.set(userReportRef, {
      reportUrl: url,
      orderId,
      labId,
      createdAt: new Date(),
    });

    await batch.commit();

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, reportUrl: url } : order
      )
    );

    alert("✅ Report uploaded successfully!");
  } catch (e) {
    console.error("Error uploading report:", e);
    alert("Failed to upload report.");
  }
};


  const handleDelete = async (
    orderId: string,
    reportDocId: string,
    labReportDocId?: string
  ) => {
    const user = auth.currentUser;
    const labId = localStorage.getItem("labDocId");
    if (!user || !labId) return;

    try {
      const batch = writeBatch(db);

      if (reportDocId) {
        batch.delete(doc(db, `UserData/${user.uid}/Reports/${reportDocId}`));
      }
      if (labReportDocId) {
        batch.delete(doc(db, `LabData/${labId}/Reports/${labReportDocId}`));
      }

      await batch.commit();

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, reportUrl: undefined } : order
        )
      );
    } catch (e) {
      console.error("Error deleting report:", e);
    }
  };

  // for payment:
  const handleMarkPaymentDone = async (order: Order) => {
    if (!order.testId || !order.userId) {
      alert("Missing test or user ID.");
      return;
    }

    try {
      const testDocRef = doc(
        db,
        `LabData/${localStorage.getItem("labDocId")}/Tests/${order.testId}`
      );
      const testSnap = await getDoc(testDocRef);

      if (!testSnap.exists()) {
        alert("Test details not found.");
        return;
      }

      const price = testSnap.data().price || 0;

      const paymentDocRef = doc(
        db,
        `UserData/${order.userId}/Payments/${order.id}`
      );
      await updateDoc(paymentDocRef, {
        paymentStatus: "done",
        amount: price,
        updatedAt: new Date(),
      });

      alert("✅ Payment marked as done.");
    } catch (err) {
      console.error("❌ Error marking payment done:", err);
      alert("Failed to update payment status.");
    }
  };

  const filteredOrders = orders.filter(
    (order) => filter === "all" || order.status === filter
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#00ACC1]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-[#374151] mb-6 text-center">
          Orders Dashboard
        </h1>

        <div className="flex justify-center items-center mb-6">
          {(["all", "pending", "approved", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`ml-2 py-2 px-4 rounded ${
                filter === f
                  ? "bg-[#3FA65C] text-white"
                  : "bg-gray-200 text-[#374151]"
              } transition duration-200`}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-[#00ACC1] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#374151] text-lg font-semibold">
              Loading orders...
            </p>
          </div>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">
                    Test Name
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Patient Name
                  </th>
                  <th className="border border-gray-300 p-3 text-left">Date</th>
                  <th className="border border-gray-300 p-3 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Actions
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="border border-gray-300 p-3">
                      {order.testName}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {order.patientName}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {order.date
                        ? new Date(order.date).toLocaleDateString()
                        : new Date().toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-3 capitalize">
                      {order.status}
                    </td>
                    <td className="border border-gray-300 p-3 space-x-2">
                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "approved")
                            }
                            className="bg-[#3FA65C] text-white py-1 px-3 rounded hover:bg-[#2e8c4a]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "dismissed")
                            }
                            className="bg-[#F57F17] text-white py-1 px-3 rounded hover:bg-[#d66b0f]"
                          >
                            Dismiss
                          </button>
                        </>
                      )}

                      {order.status === "approved" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "completed")
                          }
                          className="bg-[#007BFF] text-white py-1 px-3 rounded hover:bg-[#0056b3]"
                        >
                          Mark Done
                        </button>
                      )}

                      {order.status === "completed" && (
                        <>
                          {!order.reportUrl ? (
                           <CldUploadWidget
  uploadPreset="mylabgo-user-reports"
  options={{
    resourceType: "raw",
    folder: "reports",
    multiple: false,
  }}
  onSuccess={(results) => {
    if (
      results.info &&
      typeof results.info !== "string" &&
      "secure_url" in results.info
    ) {
      const url = results.info.secure_url;
      handleUpload(order.id, url);
    }
  }}
>
  {({ open }) => (
    <button
      onClick={() => open()}
      className="bg-gray-600 text-white py-1 px-3 rounded hover:bg-gray-800"
    >
      Upload Report
    </button>
  )}
</CldUploadWidget>

                          ) : (
                            <>
                              <span className="text-green-600 font-semibold">
                                ✔️ Uploaded
                              </span>
                              <a
                                href={order.reportUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 underline"
                              >
                                View
                              </a>
                              <button
                                onClick={() =>
                                  handleDelete(
                                    order.id,
                                    order.reportDocId || "",
                                    order.labReportDocId
                                  )
                                }
                                className="ml-2 text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </td>

                    <td className="border border-gray-300 p-3">
                      {order.paymentMethod} <br/>

                      <button
                        onClick={() => handleMarkPaymentDone(order)}
                        className="ml-2 bg-green-300 text-white py-1 px-2 rounded hover:bg-green-500"
                      >
                        Done Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <p className="text-center text-[#374151] mt-4">
                No orders to display.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
