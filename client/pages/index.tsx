import MsgList from "../src/components/UI/MsgList";
import MsgListFetcher from "../src/components/Fetcher/MsgListFetcher";
import fetcher from "../src/api";
import { METHOD, Message, Users } from "../src/types";

const Home = ({ smsgs, users }: { smsgs: Message[]; users: Users }) => (
  <>
    <h1>home</h1>
    <MsgListFetcher smsgs={smsgs} users={users} />
  </>
);

export const getServerSideProps = async () => {
  const smsgs = await fetcher(METHOD.GET, "/messages");
  const users = await fetcher(METHOD.GET, "/users");

  return {
    props: { smsgs, users },
  };
};

export default Home;
