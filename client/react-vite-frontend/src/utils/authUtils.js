// authUtils.js
async function checkTokenValidity(
  setLoggedInEmail,
  setUserRole,
  setLoginStatus
) {
  const token = localStorage.getItem("token");

  if (!token) {
    setLoginStatus("auth");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/auth/checkToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }), // Ensure token is sent with "token" key
    });
    const data = await response.json();
    if (response.ok) {
      setLoggedInEmail(data.decoded.email);
      setUserRole(data.decoded.role);
      setLoginStatus("success");
    } else {
      setLoginStatus("auth");
    }
  } catch (error) {
    console.error("Error checking token validity:", error);
    setLoginStatus("auth");
  }
}

export { checkTokenValidity };
