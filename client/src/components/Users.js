import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
  const [Users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  /*
    토큰을 캔슬시키는것
    req 캔슬시키는것 컴포넌트가 unMount일때
  */
  useEffect(() => {
    let isMounted = true;
    //AbortController 인터페이스는 하나 이상의 웹 요청을 취소할 수 있게 해준다.
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setUsers(response.data);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      //DOM 요청이 완료되기 전에 취소한다.
      //이를 통해 fetch 요청 (en-US), 모든 응답 Body 소비, 스트림을 취소할 수 있다.
      controller.abort();
    };
  }, []);

  return (
    <article>
      <h2>Users List</h2>
      {Users?.length ? (
        <ul>
          {Users.map((user, i) => (
            <li key={i}>{user?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default Users;
