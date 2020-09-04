export default {
  config: {
    apiUrl: "http://localhost:8000/api/",
    baseUrl: "http://192.168.22.33:3000/",
    imageUrl: "http://localhost:8000/server/Images/",
  },
  getToken: () => {
    return localStorage.getItem("auth_Token");
  },

  check_Auth: (props) => {
    let auth_Token = "DATA TOKEN";

    if (auth_Token === null && props.location.pathname === "/login") {
      props.push("/login");
    } else {
      if (props.location.pathname === "/login") {
        props.goBack();
      }
    }
  },
};
