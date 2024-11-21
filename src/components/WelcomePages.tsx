import axios from "axios";
import { useEffect, useState } from "react";

interface User {
  fullname: string;
}

export const WelcomePages = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/auth/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        //console.log(response.data.user);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-4 mt-10">
      <div className="flex items-center space-x-3 md:mt-28 mt-28">
        <h1 className="text-2xl md:text-4xl font-bold md:mb-20 mb-20">
          Welcome,{" "}
          <span className="text-2xl md:text-5xl text-green-900">
          {user?.fullname}✌️
          </span>
          <p className="text-lg mt-4 md:text-xl italic text-gray-900 text-center">
            It's like walking into a bookstore—where will your curiosity take
            you today?
          </p>
        </h1>
      </div>
    </div>
  );
};
