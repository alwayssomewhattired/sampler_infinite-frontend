// this is where you put the database I'm assuming

import { createApi } from "@reduxjs/toolkit/query/react"

const api = createApi({
  reducerPath: "apiOne",
});

export default api;
