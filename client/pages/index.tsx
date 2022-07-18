import MsgList from "../components/MsgList";
import fetcher from "../fetcher";

const Home = ({ smsgs }) => (
  <>
    <h1>home</h1>
    <MsgList smsgs={smsgs} />
  </>
);

export const getServerSideProps = async () => {
  const smsgs = await fetcher("get", "/messages");
  return {
    props: { smsgs },
  };
};

export default Home;
