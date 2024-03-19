const request = async (url, method = "GET", body) => {
  let options = {
    method: method,
  };

  if (body) {
    options.body = JSON.stringify(body);
    options.headers = {
      "Content-Type": "application/json",
    };
  }

  const response = await fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Сервер передал ошибку: " +
            response.status +
            " " +
            response.statusText
        );
      }

      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err.message;
    });

  return response;
};

export { request };
