"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../../lib/firebase";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";

// Firestore imports
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../../../lib/firebase"; // Make sure you export 'app' from your firebase config

import Image from "next/image";



function Page() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [labname, setLabName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [labImageUrl, setLabImageUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Initialize Firestore
  const db = getFirestore(app);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword || !labname || !labImageUrl) {
      setError("All fields including image are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
        photoURL: labImageUrl,
      });

      // Store lab data in Firestore
      await addDoc(collection(db, "LabData"), {
        email,
        labName: labname,
        userName: username,
        imgUrl: labImageUrl,
      });

      console.log("User registered and lab data stored successfully");

      
      router.push("/lab-description");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong.");
        console.error(err);
      } else {
        setError("Something went wrong.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container" style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Lab Name:</label>
          <input
            type="text"
            value={labname}
            onChange={e => setLabName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Lab Image:</label>

<CldUploadWidget
  uploadPreset="lab_upload_preset"
  onSuccess={(results: CloudinaryUploadWidgetResults) => {
    // Type narrowing: make sure info is an object, not a string
    if (typeof results.info === "object" && results.info?.secure_url) {
      setLabImageUrl(results.info.secure_url);
    }
  }}
>
  {({ open }) => (
    <button type="button" onClick={() => open()}>
      {labImageUrl ? "Change Image" : "Upload Image"}
    </button>
  )}
</CldUploadWidget>

          {labImageUrl && (
  <div style={{ marginTop: 8 }}>
    <Image
      src={labImageUrl}
      alt="Lab"
      width={100}
      height={100}
      style={{ objectFit: "cover" }}
    />
  </div>
)}

        </div>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Page;
