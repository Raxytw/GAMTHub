import { useEffect, useState } from "react";
import NewYearCanva from "./bonus/NewYearCanva";
import SnowCanva from "./bonus/SnowCanva";

export default function HolidayRenderer() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (month === 1 && day === 1) {
    return <NewYearCanva />;
  } else if (month === 12) {
    return <SnowCanva />;
  }

  return null;
}
