import { request, result } from "../../../../test/utils";
import {
  invalidUsername,
  inUseUsername,
  invalidFirstname,
  invalidLastname
} from "./errors";

export default () => {
  describe("/names", () => {
    const url = "/register/names";
    it("error response if invalid username", async () => {
      result(
        await request("post", url, {
          json: {
            username: "..11564."
          }
        }),
        { "4xx": invalidUsername }
      );

      result(
        await request("post", url, {
          json: {
            username: "a"
          }
        }),
        { "4xx": invalidUsername }
      );

      result(
        await request("post", url, {
          json: {
            username: "ab"
          }
        }),
        { "4xx": invalidUsername }
      );
    });

    it("already registred username", async () => {
      result(
        await request("post", url, {
          json: {
            username: "ferco1"
          }
        }),
        { "4xx": inUseUsername }
      );
    });

    it("invalid name", async () => {
      result(
        await request("post", url, {
          json: {
            username: "username",
            fn: "00"
          }
        }),
        { "4xx": invalidFirstname }
      );

      result(
        await request("post", url, {
          json: {
            username: "username",
            fn: "fo"
          }
        }),
        { "4xx": invalidFirstname }
      );
    });

    it("invalid last name", async () => {
      result(
        await request("post", url, {
          json: {
            username: "username",
            fn: "Vanilla",
            ln: "0"
          }
        }),
        { "4xx": invalidLastname }
      );

      result(
        await request("post", url, {
          json: {
            username: "username",
            fn: "Vanilla",
            ln: "fo"
          }
        }),
        { "4xx": invalidLastname }
      );
    });

    it("valid names", async () => {
      result(
        await request("post", url, {
          json: {
            username: "username",
            fn: "Vanilla",
            ln: "Origin"
          }
        }),
        200
      );
    });
  });
};
