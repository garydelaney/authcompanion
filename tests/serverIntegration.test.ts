import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";

Deno.test({
  name: "API Endpoint Test: /auth/register",
  async fn() {
    const requestBody = {
      "name": "Authy Person Testcases",
      "email": "test_pass@authcompanion.com",
      "password": "mysecretpass",
    };

    const response = await fetch("http://localhost:3002/api/v1/auth/register", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // body data type must match "Content-Type" header
    });

    response.json(); // parses JSON response into native JavaScript objects

    assertEquals(
      response.status,
      201,
      "The API did not return a successful response",
    );
  },
});

Deno.test({
  name: "API Endpoint Test: /auth/login",
  async fn() {
    const requestBody = {
      "email": "test_pass@authcompanion.com",
      "password": "mysecretpass",
    };

    const response = await fetch("http://localhost:3002/api/v1/auth/login", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // body data type must match "Content-Type" header
    });

    response.json(); // parses JSON response into native JavaScript objects

    assertEquals(
      response.status,
      200,
      "The API did not return a successful response",
    );
  },
});

Deno.test({
  name: "API Endpoint Test: /auth/refresh",
  async fn() {
    const requestBody = {
      "email": "test_pass@authcompanion.com",
      "password": "mysecretpass",
    };

    const response = await fetch("http://localhost:3002/api/v1/auth/login", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // body data type must match "Content-Type" header
    });

    response.json(); // parses JSON response into native JavaScript objects

    assertEquals(
      response.status,
      200,
      "The API did not return a successful response",
    );
  },
});

Deno.test({
  name: "API Endpoint Test: /auth/users/me",
  async fn() {
    const requestBody = {
      "name": "Authy Person Testcases",
      "email": "test_pass@authcompanion.com",
      "password": "mysecretpass",
    };

    const token =
      "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgzMWE1NDRmLTcxMTItNGFiMi1iZDkwLTZjY2ViOTZkMzU2ZCIsIm5hbWUiOiJBdXRoeSBQZXJzb24gVGVzdGNhc2VzIiwiZW1haWwiOiJ0ZXN0X3Bhc3NAYXV0aGNvbXBhbmlvbi5jb20iLCJleHAiOjE2MzE5MDg5MDd9.Dq8ohegpWUlZFoxEqkuyWDWB_QOQwVRbSQ6Av36eBVRsPNRSQ07kJ7vvr6wD0XvkXU_mkk0DRxrE09VbStRwqg";

    const response = await fetch("http://localhost:3002/api/v1/auth/users/me", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody), // body data type must match "Content-Type" header
    });

    response.json(); // parses JSON response into native JavaScript objects

    assertEquals(
      response.status,
      200,
      "The API did not return a successful response",
    );
  },
});

Deno.test({
  name: "API Endpoint Test: /auth/recovery",
  async fn() {
    const requestBody = {
      "email": "test_pass@authcompanion.com",
    };

    const response = await fetch("http://localhost:3002/api/v1/auth/recovery", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // body data type must match "Content-Type" header
    });

    response.json(); // parses JSON response into native JavaScript objects

    assertEquals(
      response.status,
      200,
      "The API did not return a successful response",
    );
  },
});

// TODO
// Deno.test({
//     name: "API Endpoint Test: /auth/recovery/token",
//     async fn() {
//       const requestBody = {
//         "token": "token",
//       };

//       const response = await fetch("http://localhost:3002/api/v1/recovery/token", {
//         method: "POST", // *GET, POST, PUT, DELETE, etc.
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestBody), // body data type must match "Content-Type" header
//       });

//       response.json(); // parses JSON response into native JavaScript objects

//       assertEquals(
//         response.status,
//         200,
//         "The API did not return a successful response",
//       );
//     },
//   });

Deno.test({
  name: "API Endpoint Test: /auth/logout",
  async fn() {
    const token =
      "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgzMWE1NDRmLTcxMTItNGFiMi1iZDkwLTZjY2ViOTZkMzU2ZCIsIm5hbWUiOiJBdXRoeSBQZXJzb24gVGVzdGNhc2VzIiwiZW1haWwiOiJ0ZXN0X3Bhc3NAYXV0aGNvbXBhbmlvbi5jb20iLCJleHAiOjE2MzE5MDg5MDd9.Dq8ohegpWUlZFoxEqkuyWDWB_QOQwVRbSQ6Av36eBVRsPNRSQ07kJ7vvr6wD0XvkXU_mkk0DRxrE09VbStRwqg";

    const response = await fetch("http://localhost:3002/api/v1/auth/logout", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    await response.json();

    assertEquals(
      response.status,
      200,
      "The API did not return a successful response",
    );
  },
});
