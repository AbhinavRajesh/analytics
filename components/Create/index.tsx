import { useAuth } from "hooks/useAuth";
import { useState } from "react";

const Create = () => {
  const [url, setUrl] = useState<string>();
  const { user } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = await user?.getIdToken();
    const response = await fetch("/api/url/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        slug: "p",
        url,
        uid: user?.uid,
      }),
    }).then(async (res) => await res.json());

    console.log(response);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="bg-transparent"
      />
      <button>Submit</button>
    </form>
  );
};

export default Create;
