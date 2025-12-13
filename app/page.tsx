import { redirect } from "next/navigation";

const HomePage = () => {
  redirect("/pokedex");
  return null;
};

export default HomePage;
