import { useAuth } from "hooks/useAuth";
import { Fragment, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";

const Create = () => {
  const [url, setUrl] = useState<string>();
  const [slug, setSlug] = useState<string>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<{ slug: string; url: string }>();
  const [error, setError] = useState<string>();
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
        slug:
          typeof slug === "undefined" || slug.length === 0 ? undefined : slug,
        url,
        user_id: user?.uid,
      }),
    }).then(async (res) => await res.json());

    if (response.success) {
      setModalOpen(true);
      setResponse({
        slug: response.slug,
        url: response.url,
      });
    } else {
      setError(
        response.message ?? "Some error occured. Please try again later."
      );
    }
  };

  return (
    <>
      <div className="flex flex-col bg-[#00000070] px-[100px] py-[70px] rounded-md shadow backdrop-blur-xl backdrop-filter">
        <h2 className="font-bold text-3xl">Shorten URLS</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-5 gap-x-[20px] mt-[20px]"
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white text-black placeholder:text-gray-600 py-[8px] px-[16px] col-span-3 rounded"
            placeholder="Enter a url"
          />
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="bg-white text-black placeholder:text-gray-600 py-[8px] px-[20px] border-l rounded"
            placeholder="Enter slug"
          />
          <button className="text-white font-bold bg-blue-500 hover:bg-blue-400 duration-300 transition-all ease-in-out py-[15px] px-[30px] rounded">
            Shorten URL
          </button>
        </form>
      </div>
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => {
            setModalOpen(false);
            setResponse(undefined);
          }}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  URL shortened!
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Your URL{" "}
                    <a
                      href={response?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {response?.url}
                    </a>{" "}
                    has been successfully shortened to{" "}
                    <a
                      href={`https://weee.tk/${response?.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://weee.tk/{response?.slug}
                    </a>
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => {
                      setModalOpen(false);
                      setResponse(undefined);
                    }}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Create;
