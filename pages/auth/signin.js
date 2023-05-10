import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/router";

export default function Signin() {
  const router = useRouter();
  //
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const user = auth.currentUser.providerData[0];
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          userName: user.displayName.split(" ").join("").toLocaleLowerCase(),
          userImg: user.photoURL,
          uid: user.uid,
          timeStamp: serverTimestamp(),
        });
      }
      router.push("/");
      // const user = auth.currentUser.uid;
      // console.log(user);
    } catch (error) {}
  };

  return (
    <div className="flex justify-center h-screen items-center space-x-4">
      <img
        src="https://www.techbooky.com/wp-content/uploads/2021/07/4859E08D-388B-4475-9FCC-C05914CC654A.png"
        alt="twitter sign in image"
        className="hidden md:inline-flex object-cover md:w-48 md:h-96"
      />
      <div className="ml-2">
        <div className="flex flex-col items-center">
          <img
            src="https://logos-world.net/wp-content/uploads/2020/04/Twitter-Logo.png"
            alt="twitter logo"
            className="w-36 object-cover"
          />
          <p className="text-center text-sm italic my-10">
            This app is a practice project NOT THE REAL TWITTER
          </p>
          <button
            className="bg-red-400 rounded-lg p-4 text-white font-bold hover:bg-red-500"
            onClick={onGoogleClick}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
