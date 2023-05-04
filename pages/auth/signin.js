import { getProviders, signIn } from "next-auth/react";

export default function signin({ providers }) {
  return (
    <div className="flex justify-center h-screen items-center space-x-4">
      <img
        src="https://www.techbooky.com/wp-content/uploads/2021/07/4859E08D-388B-4475-9FCC-C05914CC654A.png"
        alt="twitter sign in image"
        className="hidden md:inline-flex object-cover md:w-48 md:h-96"
      />
      <div className="ml-2">
        {Object.values(providers).map((provider) => (
          <div key={provider.name} className="flex flex-col items-center">
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
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
