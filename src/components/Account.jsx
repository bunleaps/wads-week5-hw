import { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Account({ onProfileUpdate }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const displayName = auth.currentUser.displayName || "";
        const [firstName = "", lastName = ""] = displayName.split(" ");
        setFirstName(firstName);
        setLastName(lastName);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      let photoURL = user.photoURL;

      // Upload new profile picture if selected
      if (profilePic) {
        const imageRef = ref(storage, `profilePics/${user.uid}`);
        await uploadBytes(imageRef, profilePic);
        photoURL = await getDownloadURL(imageRef);
      }

      // Update auth profile
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: photoURL,
      });

      // Check if document exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userDocRef, {
          firstName,
          lastName,
          photoURL,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Create new document
        await setDoc(userDocRef, {
          firstName,
          lastName,
          email: user.email,
          photoURL,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      setMessage({ text: "Profile updated successfully!", type: "success" });
      if (onProfileUpdate) onProfileUpdate(); // Notify parent component of update
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Account Settings
          </h2>
          {message.text && (
            <p
              className={`mt-2 text-center text-sm ${
                message.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <img
            src={auth.currentUser?.photoURL}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
          />
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <p className="p-2 font-semibold">Avatar Upload</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Account;
