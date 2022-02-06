import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./useAuth";

interface UrlData {
  url: string;
  slug: string;
  id: string;
  created_at: string;
  analytics: any[];
}

interface DataInterface {
  data: UrlData[];
  setData: Dispatch<SetStateAction<UrlData[]>>;
  addData: (data: UrlData) => void;
  getData: (url: string) => UrlData | undefined;
}

const DataContext = createContext<DataInterface>({
  data: [],
  setData: () => {},
  addData: (_data: UrlData) => {},
  getData: (_url: string) => {
    return undefined;
  },
});

const DataProvider = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  const [data, setData] = useState<UrlData[]>([]);

  const addData = ({
    id,
    url,
    slug,
    created_at,
    analytics = [],
  }: UrlData): void => {
    setData((prev) => [...prev, { url, slug, analytics, created_at, id }]);
  };

  const getData = (url: string): UrlData | undefined => {
    const requiredData = data.find((d) => d.url === url);
    return requiredData;
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchData = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/url`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
      console.log(response);
    } catch (err) {}
  };

  return (
    <DataContext.Provider value={{ data, setData, addData, getData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataInterface => {
  const { addData, data, getData, setData } = useContext(DataContext);

  return {
    addData,
    data,
    getData,
    setData,
  };
};

export default DataProvider;
