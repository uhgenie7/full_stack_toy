import MsgList from "../components/MsgList";
import { fetcher } from "../queryClient";
import { GET_MESSAGES } from "../graphql/messages";
import { GET_USERS } from "../graphql/user";

const Home = ({ smsgs, users }) => (
  <>
    <h1>home</h1>
    <MsgList smsgs={smsgs} users={users} />
  </>
);

export const getServerSideProps = async () => {
  const smsgs = await fetcher(GET_MESSAGES);
  const users = await fetcher(GET_USERS);
  console.log({ smsgs, users });
  return {
    props: { smsgs: [], users: {} },
  };
};

export default Home;
